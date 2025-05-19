import { validatePassword, validateUser } from '../schemas/user.js'
import { User } from '../models/user.js'
import { Op } from 'sequelize'
import { generateAccessToken } from '../utils/jwt.js'
import { sendVerificationEmail, sendResetPasswordEmail } from '../utils/email/sendEmail.js'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

/**
 * Controlador de autenticación y gestión de usuarios.
 */
export class AuthController {
  /**
   * Realiza login de usuario.
   * Valida credenciales y devuelve token de acceso en cookie.
   *
   * @throws {404} Si no se encuentra el usuario.
   * @throws {403} Si el usuario está baneado o no ha verificado el email.
   * @throws {401} Si la contraseña es incorrecta.
   * @throws {500} Error interno del servidor.
   */
  static async login (req, res) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ where: { email } })

      if (!user) {
        return res.status(404).json({ code: 'user_not_found' })
      }

      if (user.banned) {
        return res.status(403).json({ code: 'user_banned' })
      }

      if (!user.isVerified) {
        return res.status(403).json({ code: 'email_not_verified' })
      }

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return res.status(401).json({ code: 'invalid_user_data' })
      }

      const { password: _, ...userData } = user.toJSON()
      const accessToken = generateAccessToken(user)

      res.cookie('access_token', accessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 })

      res.status(200).json(userData)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Devuelve los datos del usuario autenticado.
   * Requiere token válido para identificar usuario.
   *
   * @throws {404} Si el usuario no existe.
   * @throws {500} Error interno del servidor.
   */
  static async getUser (req, res) {
    try {
      if (!req.user) {
        return res.status(200).json(null)
      }
      const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } })

      if (!user) {
        return res.status(404).json({ code: 'user_not_found' })
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Registra un nuevo usuario.
   * Valida datos, comprueba contraseñas, verifica existencia y crea usuario.
   *
   * @throws {400} Datos inválidos o contraseñas no coinciden.
   * @throws {403} Email baneado.
   * @throws {409} Email o username ya registrados.
   * @throws {500} Error interno del servidor o al enviar email.
   */
  static async register (req, res) {
    const newUser = validateUser(req.body)

    if (!newUser.success) {
      return res.status(400).json({ code: newUser.error.issues[0].message })
    }

    const { password, confirmPassword } = req.body
    if (!confirmPassword) {
      return res.status(400).json({ code: 'empty_confirm_password' })
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ code: 'passwords_do_not_match' })
    }

    try {
      const existingEmail = await User.findOne({ where: { email: newUser.data.email } })
      if (existingEmail && existingEmail.banned) {
        return res.status(403).json({ code: 'email_banned' })
      }
      if (existingEmail) {
        return res.status(409).json({ code: 'email_already_registered' })
      }

      const existingUsername = await User.findOne({ where: { username: newUser.data.username } })
      if (existingUsername) {
        return res.status(409).json({ code: 'username_already_exists' })
      }

      const hashedPassword = await bcrypt.hash(newUser.data.password, 10)
      const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

      const user = await User.create({
        ...newUser.data,
        password: hashedPassword,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 60 * 60 * 1000
      })

      try {
        const acceptLanguage = req.headers['accept-language']
        console.log('Accept-Language:', acceptLanguage)
        await sendVerificationEmail(user.email, verificationToken, acceptLanguage)
      } catch (error) {
        console.error('Error sending verification email:', error)
        return res.status(500).json({ code: 'email_sending_error' })
      }
      const { password: _, ...userData } = user.toJSON()
      res.status(201).json(userData)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Cierra sesión limpiando cookie de token.
   */
  static async logout (req, res) {
    res.clearCookie('access_token')
    res.status(200).json({ code: 'logout_success', success: true })
  }

  /**
   * Verifica email mediante token de verificación.
   *
   * @throws {400} Token inválido o expirado.
   * @throws {500} Error interno del servidor.
   */
  static async verifyEmail (req, res) {
    const { verificationToken } = req.body

    try {
      const user = await User.findOne({ where: { verificationToken, verificationTokenExpiresAt: { [Op.gt]: new Date() } } })

      if (!user) {
        const expiredUser = await User.findOne({
          where: {
            verificationToken,
            verificationTokenExpiresAt: { [Op.lt]: new Date() }
          }
        })

        if (expiredUser) {
          return res.status(400).json({ code: 'token_expired' })
        }
        return res.status(400).json({ code: 'invalid_verification_token' })
      }

      await user.update({
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null
      })
      res.status(200).json({ code: 'email_verified', success: true })
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Reenvía email de verificación.
   *
   * @throws {400} Email vacío o ya verificado.
   * @throws {404} Usuario no encontrado.
   * @throws {500} Error interno del servidor.
   */
  static async resendVerificationEmail (req, res) {
    try {
      const { email } = req.body

      if (!email) {
        return res.status(400).json({ code: 'empty_email' })
      }

      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(404).json({ code: 'user_not_found' })
      }

      if (user.isVerified) {
        return res.status(400).json({ code: 'email_already_verified' })
      }

      const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
      const verificationTokenExpiresAt = Date.now() + 60 * 60 * 1000

      await user.update({
        verificationToken,
        verificationTokenExpiresAt
      })

      const acceptLanguage = req.headers['accept-language']
      await sendVerificationEmail(user.email, verificationToken, acceptLanguage)

      res.status(200).json({ code: 'verification_email_resent' })
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Solicita recuperación de contraseña enviando email con token.
   *
   * @throws {400} Email vacío.
   * @throws {404} Usuario no encontrado.
   * @throws {500} Error interno del servidor.
   */
  static async forgotPassword (req, res) {
    try {
      const { email } = req.body
      if (!email) {
        return res.status(400).json({ code: 'empty_email' })
      }

      const user = await User.findOne({ where: { email } })
      if (!user) {
        return res.status(404).json({ code: 'user_not_found' })
      }
      const resetToken = crypto.randomBytes(20).toString('hex')

      await user.update({
        resetToken,
        resetTokenExpiresAt: Date.now() + 60 * 60 * 1000
      })

      const acceptLanguage = req.headers['accept-language']
      await sendResetPasswordEmail(user.email, resetToken, acceptLanguage)
      res.status(200).json({ code: 'verification_email_resent' })
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Resetea la contraseña con token y nueva contraseña.
   * Valida contraseña y token, actualiza la contraseña.
   *
   * @throws {400} Token o nueva contraseña inválidos o expirados.
   * @throws {500} Error interno del servidor.
   */
  static async resetPassword (req, res) {
    try {
      const { token, newPassword } = req.body

      if (!token) {
        return res.status(400).json({ code: 'invalid_link' })
      }
      if (!newPassword) {
        return res.status(400).json({ code: 'empty_new_password' })
      }

      const passwordValidation = validatePassword(newPassword)
      if (!passwordValidation.success) {
        return res.status(400).json({ code: passwordValidation.error.issues[0].message })
      }

      const user = await User.findOne({
        where: {
          resetToken: token,
          resetTokenExpiresAt: { [Op.gt]: Date.now() }
        }
      })

      if (!user) {
        return res.status(400).json({ code: 'link_expired' })
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)

      await user.update({
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiresAt: null
      })

      res.status(200).json({ code: 'password_reset_success' })
    } catch (error) {
      console.error('Error in resetPassword:', error.message)
      console.error('Stack trace:', error.stack)
      res.status(500).json({ code: 'internal_server_error' })
    }
  }
}
