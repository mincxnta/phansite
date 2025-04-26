import { validateUser } from '../schemas/user.js'
import { User } from '../models/user.js'
import bcrypt from 'bcrypt'

export class AdminController {
  static async create (req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ code: 'forbidden' })
    }

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
