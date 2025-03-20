import { validateNewUser } from '../schemas/users.js'
import { User } from '../models/user.js'

export class AuthController {
  static async login (req, res) {
    try {
      const { username, password } = req.body
      const user = await User.findOne({ where: { username } })

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      if (user.password !== password) {
        return res.status(401).json({ error: 'Contraseña incorrecta' })
      }

      const { password: _, ...userData } = user.toJSON()
      res.json(userData)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async register (req, res) {
    const newUser = validateNewUser(req.body)

    if (!newUser.success) {
      return res.status(400).json({ error: JSON.parse(newUser.error.message) })
    }

    try {
      const user = await User.create(newUser.data)
      const { password: _, ...userData } = user.toJSON()
      res.status(201).json(userData)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}
