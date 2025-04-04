import { validateUpdatedUser } from '../schemas/users.js'
import { User } from '../models/user.js'
import bcrypt from 'bcrypt'

export class UserController {
  static async getAll (req, res) {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ code: 'forbidden' })
    }

    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] }
      })
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  static async getById (req, res) {
    try {
      const { username } = req.params
      const user = await User.findOne({ where: { username }, attributes: { exclude: ['password'] } })

      if (!user) {
        return res.status(404).json({ code: 'user_not_found' })
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  static async update (req, res) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ code: 'unauthorized' })
    }

    const user = await User.findByPk(req.user.id)
    if (!user) {
      return res.status(404).json({ code: 'user_not_found' })
    }

    const updatedUser = validateUpdatedUser(req.body)

    if (!updatedUser.success) {
      return res.status(400).json({ code: updatedUser.error.issues[0].message })
    }

    try {
      if (updatedUser.data.password) {
        updatedUser.data.password = await bcrypt.hash(updatedUser.data.password, 10)
      }

      await user.update(updatedUser.data)
      const updatedUserData = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } })
      res.status(200).json(updatedUserData)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  // TODO Eliminaremos usuarios?
  static async delete (req, res) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ code: 'unauthorized' })
    }

    try {
      const user = await User.findByPk(req.user.id)

      if (!user) {
        return res.status(404).json({ code: 'user_not_found' })
      }
      await user.destroy()
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  static async ban (req, res) {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ code: 'forbidden' })
    }

    const { id } = req.params

    try {
      const user = await User.findByPk(id)
      if (!user) {
        return res.status(404).json({ code: 'user_not_found' })
      }

      await user.update({ banned: true })
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }
}
