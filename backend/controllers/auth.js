import { validateUser } from '../schemas/user.js'
import { User } from '../models/user.js'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js'
import bcrypt from 'bcrypt'

export class AuthController {
  static async login (req, res) {
    try {
      const { username, password } = req.body
      const user = await User.findOne({ where: { username } })

      if (!user) {
        return res.status(404).json({ code: 'user_not_found' })
      }

      if (user.banned) {
        return res.status(403).json({ code: 'user_banned' })
      }

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return res.status(401).json({ code: 'invalid_user_data' })
      }

      const { password: _, ...userData } = user.toJSON()
      const accessToken = generateAccessToken(user)
      const refreshToken = generateRefreshToken(user)

      res.cookie('access_token', accessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 })
      res.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 })

      res.status(200).json(userData)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

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
      const user = await User.create({ ...newUser.data, password: hashedPassword })
      const { password: _, ...userData } = user.toJSON()
      res.status(201).json(userData)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  static async logout (req, res) {
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    res.status(200).json({ code: 'logout_success', success: true })
  }

  // TODO Preguntar cómo manejar, guardar en BBDD
  static async refresh (req, res) {
    const refreshToken = req.cookies.refresh_token

    if (!refreshToken) {
      return res.status(403).json({ code: 'missing_refresh_token' })
    }

    try {
      const data = verifyRefreshToken(refreshToken)
      const user = await User.findByPk(data.id)

      if (!user) {
        return res.status(403).json({ code: 'forbidden' })
      }

      const newAccessToken = generateAccessToken(user)
      res.cookie('access_token', newAccessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 })
      res.status(200).json({ code: 'token_refreshed', success: true })
    } catch (error) {
      res.status(403).json({ code: 'forbidden' })
    }
  }
}
