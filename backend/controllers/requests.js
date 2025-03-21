import { validateRequest, validateUpdatedRequest } from '../schemas/requests.js'
import { Request } from '../models/request.js'

export class RequestController {
  static async getAll (req, res) {
    try {
      const requests = await Request.findAll({
        order: ['submitDate', 'DESC']
      })
      res.json(requests)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async getAllByUser (req, res) {
    try {
      const requests = await Request.findAll({
        where: { userId: req.user.id },
        order: ['submitDate', 'DESC']
      })
      res.json(requests)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async getById (req, res) {
    try {
      const { id } = req.params
      const request = await Request.findByPk(id)

      if (!request) {
        return res.status(404).json({ error: 'Petición no encontrada' })
      }
      res.json(request)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async create (req, res) {
    const newRequest = validateRequest(req.body)

    if (!newRequest.success) {
      return res.status(400).json({ error: JSON.parse(newRequest.error.message) })
    }

    try {
      const requestData = {
        ...newRequest.data,
        status: 'pending'
      }
      const request = await Request.create(requestData)
      res.status(201).json(request)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async update (req, res) {
    const { id } = req.params

    const request = await Request.findByPk(id)
    if (!request) {
      return res.status(404).json({ error: 'Petición no encontrada' })
    }

    const updatedRequest = validateUpdatedRequest(req.body)

    if (!updatedRequest.success) {
      return res.status(400).json({ error: updatedRequest.error.message })
    }

    try {
      await request.update(updatedRequest.data)
      res.json(request)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  static async delete (req, res) {
    try {
      const { id } = req.params
      const user = await Request.findByPk(id)

      if (!user) {
        return res.status(404).json({ error: 'Petición no encontrada' })
      }
      await user.destroy()
      res.json({ message: `Petición ${id} eliminada` })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}
