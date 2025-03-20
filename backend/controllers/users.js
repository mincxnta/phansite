import { validateNewUser, validateUpdatedUser } from '../schemas/users.js'
import { User } from '../models/user.js'

export class UserController {
  static async getAll (req, res) {
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
      const { id } = req.params
      // Funciona?
      const user = await User.findByPk(id, { attributes: { exclude: ['password'] } })

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      res.json(user)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async create (req, res) {
    const newUser = validateNewUser(req.body)

    if (!newUser.success) {
      return res.status(400).json({ error: JSON.parse(newUser.error.message) })
    }

    try {
      const user = await User.create(newUser.data)
      res.status(201).json(user)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async update (req, res) {
    const { id } = req.params

    const user = await User.findByPk(id)
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
      const { id } = req.params
      const user = await User.findByPk(id)

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      await user.destroy()
      res.json({ message: `Usuario ${id} eliminado` })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}
