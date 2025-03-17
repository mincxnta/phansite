import { UserModel } from '../models/user.js'
import { validateNewUser } from '../schemas/users.js'

export class UserController {
  static async getAll (req, res) {
    try {
      const users = await UserModel.getAll()
      res.send(`Users found ${users}`)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }

  static async getById (req, res) {
    const { id } = req.params
    const user = await UserModel.getById({ id })
    res.send(`User ${user} found`)
  }

  static async create (req, res) {
    const newUser = validateNewUser(req.body)

    if (!newUser.success) {
      return res.status(400).json({ message: newUser.error.message })
    }

    const user = await UserModel.create(newUser.data)
    res.send(`User ${user} created`)
  }

  static async update (req, res) {
    const { id } = req.params
    const user = await UserModel.update({ id })
    res.send(`User ${user} updated`)
  }

  static async delete (req, res) {
    const { id } = req.params
    const user = await UserModel.delete({ id })
    res.send(`User ${user} deleted`)
  }
}
