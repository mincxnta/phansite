import { validateNewUser } from '../schemas/users.js'
import { User } from '../models/user.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export class AuthController {
  static async login(req, res) {
    try {
      const { username, password } = req.body
      const user = await User.findOne({ where: { username } })

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return res.status(404).json({ error: 'Contraseña incorrecta' })
      }

      const { password: _, ...userData } = user.toJSON()
      const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' })
      const refreshToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
      res.cookie('access_token', accessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 })
      res.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 })
      res.json(userData)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  // Preguntar cómo manejar, guardar en BBDD
  static async refresh(req, res) {
    const refreshToken = req.cookies.refresh_token

    if (!refreshToken) {
      return res.status(403).json({ error: 'No autorizado' })
    }

    try {
      const data = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
      const user = await User.findByPk(data.id)

      if (!user || user.id !== data.id) {
        return res.status(403).json({ error: 'No autorizado' })
      }

      const newAccessToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' })
      res.cookie('access_token', newAccessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 })
    } catch (error) {
      res.status(403).json({ error: 'No autorizado' })
    }
  }

  static async register(req, res) {
    const newUser = validateNewUser(req.body)

    if (!newUser.success) {
      return res.status(400).json({ error: JSON.parse(newUser.error.message) })
    }

    try {
      const hashedPassword = await bcrypt.hash(newUser.data.password, 10)
      const user = await User.create({ ...newUser.data, password: hashedPassword })
      const { password: _, ...userData } = user.toJSON()
      res.status(201).json(userData)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async logout(req, res) {
    res.clearCookie('access_token').clearCookie('refresh_token').json({ message: 'Logged out' })
  }
}
