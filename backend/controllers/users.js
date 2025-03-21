import { validateNewUser, validateUpdatedUser } from '../schemas/users.js'
import { User } from '../models/user.js'
import bcrypt from 'bcrypt'

export class UserController {
  static async getAll (req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' })
    }

    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] } // No retornem la contrasenya
      })
      res.json(users)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async getById (req, res) {
    try {
      const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } })

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      res.json(user)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async create (req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' })
    }

    const newUser = validateNewUser(req.body)
    if (!newUser.success) {
      return res.status(400).json({ error: JSON.parse(newUser.error.message) })
    }

    try {
      const hashedPassword = await bcrypt.hash(newUser.data.password, 10)
      const user = await User.create({ ...newUser.data, password: hashedPassword })
      res.status(201).json(user)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async update (req, res) {
    const user = await User.findByPk(req.user.id)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const updatedUser = validateUpdatedUser(req.body)

    if (!updatedUser.success) {
      return res.status(400).json({ error: updatedUser.error.message })
    }

    try {
      await user.update(updatedUser.data)
      res.json(user)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async delete (req, res) {
    try {
      const user = await User.findByPk(req.user.id)

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      await user.destroy()
      res.json({ message: 'Usuario eliminado' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}
