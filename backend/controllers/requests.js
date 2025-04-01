import { validateRequest, validateUpdatedRequest } from '../schemas/requests.js'
import { Request } from '../models/request.js'

export class RequestController {
  static async getAll(req, res) {
    try {
      const requests = await Request.findAll({
        order: [['submitDate', 'DESC']]
      })
      res.status(200).json(requests)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  static async getAllByUser(req, res) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ code: 'unauthorized' })
    }

    try {
      const requests = await Request.findAll({
        where: { userId: req.user.id },
        order: [['submitDate', 'DESC']]
      })
      res.status(200).json(requests)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params
      const request = await Request.findByPk(id)

      if (!request) {
        return res.status(404).json({ code: 'request_not_found' })
      }

      res.status(200).json(request)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  static async create(req, res) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ code: 'unauthorized' })
    }

    const newRequest = validateRequest(req.body)

    if (!newRequest.success) {
      return res.status(400).json({ code: 'invalid_request_data' })
    }

    try {
      const requestData = {
        ...newRequest.data,
        userId: req.user.id
      }
      const request = await Request.create(requestData)
      res.status(201).json(request)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  // Dejamos editar?
  // static async update (req, res) {
  //   if (!req.user || !req.user.id) {
  //     return res.status(401).json({ code: 'unauthorized' })
  //   }

  //   const { id } = req.params

  //   const request = await Request.findByPk(id)
  //   if (!request) {
  //     return res.status(404).json({ code: 'request_not_found' })
  //   }

  //   if (request.userId !== req.user.id) {
  //     return res.status(403).json({ code: 'forbidden' })
  //   }

  //   const updatedRequest = validateUpdatedRequest(req.body)

  //   if (!updatedRequest.success) {
  //     return res.status(400).json({ code: 'invalid_request_data' })
  //   }

  //   try {
  //     await request.update(updatedRequest.data)
  //     res.status(200).json(request)
  //   } catch (error) {
  //     res.status(500).json({ code: 'internal_server_error' })
  //   }
  // }

  // // Dejamos eliminar?
  // static async delete (req, res) {
  //   if (!req.user || !req.user.id) {
  //     return res.status(401).json({ code: 'unauthorized' })
  //   }

  //   try {
  //     const { id } = req.params
  //     const request = await Request.findByPk(id)

  //     if (!request) {
  //       return res.status(404).json({ code: 'request_not_found' })
  //     }

  //     if (request.userId !== req.user.id) {
  //       return res.status(403).json({ code: 'forbidden' })
  //     }

  //     await request.destroy()
  //     res.status(200).json({ success: true })
  //   } catch (error) {
  //     res.status(500).json({ code: 'internal_server_error' })
  //   }
  // }
}
