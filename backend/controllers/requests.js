import { validateRequest, validateUpdatedRequest } from '../schemas/requests.js'
import { Request } from '../models/request.js'

export class RequestController {
  static async getAll (req, res) {
    try {
      const requests = await Request.findAll({
        order: [['submitDate', 'DESC']]
      })
      res.status(200).json(requests)
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }

  static async getAllByUser (req, res) {
    try {
      const requests = await Request.findAll({
        where: { userId: req.user.id },
        order: [['submitDate', 'DESC']]
      })
      res.status(200).json(requests)
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }

  static async getById (req, res) {
    try {
      const { id } = req.params
      const request = await Request.findByPk(id)

      if (!request) {
        return res.status(404).send({ message: 'Petición no encontrada' })
      }

      res.status(200).json(request)
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }

  static async create (req, res) {
    const newRequest = validateRequest(req.body)

    if (!newRequest.success) {
      return res.status(400).send({ message: JSON.parse(newRequest.error.message) })
    }

    try {
      const requestData = {
        ...newRequest.data,
        userId: req.user.id,
        status: 'pending' // Hace falta o por defecto del modelo?
      }
      const request = await Request.create(requestData)
      res.status(201).json(request)
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }

  // Dejamos editar?
  static async update (req, res) {
    const { id } = req.params

    const request = await Request.findByPk(id)
    if (!request) {
      return res.status(404).send({ message: 'Petición no encontrada' })
    }

    if (request.userId !== req.user.id) {
      return res.status(403).send({ message: 'No autorizado' })
    }

    const updatedRequest = validateUpdatedRequest(req.body)

    if (!updatedRequest.success) {
      return res.status(400).send({ message: JSON.parse(updatedRequest.error.message) })
    }

    try {
      await request.update(updatedRequest.data)
      res.status(200).json(request)
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }

  // Dejamos eliminar?
  static async delete (req, res) {
    try {
      const { id } = req.params
      const request = await Request.findByPk(id)

      if (!request) {
        return res.status(404).send({ message: 'Petición no encontrada' })
      }

      if (request.userId !== req.user.id) {
        return res.status(403).send({ message: 'No autorizado' })
      }

      await request.destroy()
      res.status(200).send({ message: `Petición ${id} eliminada` })
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }
}
