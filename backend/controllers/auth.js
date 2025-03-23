import { validateNewUser } from '../schemas/users.js'
import { User } from '../models/user.js'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js'
import bcrypt from 'bcrypt'

export class AuthController {
  static async login (req, res) {
    try {
      const { username, password } = req.body
      const user = await User.findOne({ where: { username } })

      if (!user) {
        return res.status(404).send({ message: 'Usuario no encontrado' })
      }

      if (user.banned) {
        return res.status(403).send({ message: 'Usuario baneado' })
      }

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return res.status(401).send({ message: 'Contraseña incorrecta' })
      }

      const { password: _, ...userData } = user.toJSON()
      const accessToken = generateAccessToken(user)
      const refreshToken = generateRefreshToken(user)

      res.cookie('access_token', accessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 })
      res.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 })

      res.status(200).json(userData)
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }

  static async getUser (req, res) {
    try {
      const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } })

      if (!user) {
        return res.status(404).send({ message: 'Usuario no encontrado' })
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }

  static async register (req, res) {
    const newUser = validateNewUser(req.body)

    if (!newUser.success) {
      return res.status(400).send({ message: JSON.parse(newUser.error.message) })
    }

    try {
      const existingUser = await User.findOne({ where: { email: newUser.data.email } })
      if (existingUser && existingUser.banned) {
        return res.status(403).send({ message: 'Este correo está baneado y no puede registrarse' })
      }
      if (existingUser) {
        return res.status(409).send({ message: 'El correo ya está registrado' })
      }

      const existingUsername = await User.findOne({ where: { email: newUser.data.email } })
      if (existingUsername) {
        return res.status(409).send({ message: 'El usuario ya existe' })
      }

      const hashedPassword = await bcrypt.hash(newUser.data.password, 10)
      const user = await User.create({ ...newUser.data, password: hashedPassword })
      const { password: _, ...userData } = user.toJSON()
      res.status(201).json(userData)
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }

  static async logout (req, res) {
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    res.status(200).send({ message: 'Sesión cerrada' })
  }

  // Preguntar cómo manejar, guardar en BBDD
  static async refresh (req, res) {
    const refreshToken = req.cookies.refresh_token

    if (!refreshToken) {
      return res.status(403).send({ message: 'No autorizado' })
    }

    try {
      const data = verifyRefreshToken(refreshToken)
      const user = await User.findByPk(data.id)

      if (!user) {
        return res.status(403).send({ message: 'No autorizado' })
      }

      const newAccessToken = generateAccessToken(user)
      res.cookie('access_token', newAccessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 })
      res.status(200).send({ message: 'Token actualizado' })
    } catch (error) {
      res.status(403).send({ message: 'No autorizado' })
    }
  }
}
