import { validateNewUser } from '../schemas/users.js'
import { User } from '../models/user.js'
import bcrypt from 'bcrypt'

export class AdminController {
  static async create (req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ message: 'No autorizado' })
    }

    const newUser = validateNewUser(req.body)
    if (!newUser.success) {
      return res.status(400).send({ message: JSON.parse(newUser.error.message) })
    }

    try {
      const hashedPassword = await bcrypt.hash(newUser.data.password, 10)
      const user = await User.create({
        ...newUser.data,
        password: hashedPassword,
        banned: false // Hace falta o por defecto del modelo?
      })
      const { password: _, ...userData } = user.toJSON()
      res.status(201).json(userData)
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }
}
