import { validateNewUser } from '../schemas/users.js'
import { User } from '../models/user.js'
import bcrypt from 'bcrypt'

export class AdminController {
  static async create (req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ code: 'forbidden' })
    }

    const newUser = validateNewUser(req.body)
    if (!newUser.success) {
      return res.status(400).json({ code: 'invalid_user_data' })
    }

    try {
      const hashedPassword = await bcrypt.hash(newUser.data.password, 10)
      const user = await User.create({
        ...newUser.data,
        password: hashedPassword,
        banned: false
      })
      const { password: _, ...userData } = user.toJSON()
      res.status(201).json(userData)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }
}
