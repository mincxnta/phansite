import { validateUpdatedUser } from '../schemas/users.js'
import { User } from '../models/user.js'
import bcrypt from 'bcrypt'

export class UserController {
  static async getAll (req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' })
    }

    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }
      })
      res.status(200).json(users)
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }

  static async getMe (req, res) {
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

  static async getById (req, res) {
    try {
      const { username } = req.params
      const user = await User.findOne({ where: { username } }, { attributes: { exclude: ['password'] } })

      if (!user) {
        return res.status(404).send({ message: 'Usuario no encontrado' })
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }

  static async update (req, res) {
    const user = await User.findByPk(req.user.id)
    if (!user) {
      return res.status(404).send({ message: 'Usuario no encontrado' })
    }

    const updatedUser = validateUpdatedUser(req.body)

    if (!updatedUser.success) {
      return res.status(400).send({ message: JSON.parse(updatedUser.error.message) })
    }

    try {
      if (updatedUser.data.password) {
        updatedUser.data.password = await bcrypt.hash(updatedUser.data.password, 10)
      }

      await user.update(updatedUser.data)
      const updatedUserData = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } })
      res.status(200).json(updatedUserData)
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }

  // Eliminaremos usuarios?
  static async delete (req, res) {
    try {
      const user = await User.findByPk(req.user.id)

      if (!user) {
        return res.status(404).send({ message: 'Usuario no encontrado' })
      }
      await user.destroy()
      res.status(200).send({ message: 'Usuario eliminado' })
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }

  static async ban (req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ message: 'No autorizado' })
    }

    const { id } = req.params // ID de l'usuari a banear

    try {
      const user = await User.findByPk(id)
      if (!user) {
        return res.status(404).send({ message: 'Usuario no encontrado' })
      }

      await user.update({ banned: true })
      res.status(200).send({ message: `Usuario ${id} baneado` })
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }
}
