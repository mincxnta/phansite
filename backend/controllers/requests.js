import { validateRequest, validateUpdatedRequest } from '../schemas/request.js'
import { Request } from '../models/request.js'
import { RequestVotes } from '../models/request_votes.js'
import { validateRequestVote } from '../schemas/request_vote.js'
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js'

/**
 * Controlador para la gestión de peticiones.
 */
export class RequestController {
  /**
   * Obtiene una lista paginada de peticiones pendientes.
   *
   * @param {number} page Número de página.
   * @param {number} limit Cantidad por página.
   *
   * @throws {500} Error interno del servidor.
   */
  static async getAllPending (req, res) {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit

    try {
      const { count, rows } = await Request.findAndCountAll({
        where: { status: 'pending' },
        order: [['submitDate', 'DESC']],
        limit,
        offset
      })
      res.status(200).json({
        requests: rows,
        totalRequests: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      })
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  // TODO Añadir rol phantom_thief
  /**
   * Obtiene todas las peticiones, opcionalmente filtradas por estado.
   *
   * @param {string} status Estado de la petición para filtrar.
   * @param {number} page Número de página.
   * @param {number} limit Cantidad por página.
   *
   * @throws {500} Error interno del servidor.
   */
  static async getAll (req, res) {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit
    const status = req.query.status

    try {
      const where = status ? { status } : {}
      const { count, rows } = await Request.findAndCountAll({
        where,
        order: [['submitDate', 'DESC']],
        limit,
        offset
      })
      res.status(200).json({
        requests: rows,
        totalRequests: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      })
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Obtiene todas las peticiones creadas por el usuario autenticado.
   *
   * @throws {401} Si el usuario no está autenticado.
   * @throws {500} Error interno del servidor.
   */
  static async getAllByUser (req, res) {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit

    if (!req.user || !req.user.id) {
      return res.status(401).json({ code: 'unauthorized' })
    }

    try {
      const { count, rows } = await Request.findAndCountAll({
        where: { userId: req.user.id },
        order: [['submitDate', 'DESC']],
        limit,
        offset
      })
      res.status(200).json({
        requests: rows,
        totalRequests: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      })
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Obtiene una petición por su ID.
   *
   * @param {number} id ID de la petición.
   *
   * @throws {404} Si no se encuentra la petición.
   * @throws {500} Error interno del servidor.
   */
  static async getById (req, res) {
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

  /**
   * Crea una nueva petición asociada al usuario autenticado.
   *
   * @throws {401} Si el usuario no está autenticado.
   * @throws {403} Si el rol del usuario está prohibido.
   * @throws {400} Si la petición no es válida.
   * @throws {500} Error interno del servidor.
   */
  static async create (req, res) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ code: 'unauthorized' })
    }

    if (req.user.role === 'phantom_thief' || req.user.role === 'admin') {
      return res.status(403).json({ code: 'forbidden' })
    }

    const newRequest = validateRequest(req.body)

    if (!newRequest.success) {
      return res.status(400).json({ code: newRequest.error.issues[0].message })
    }

    try {
      const requestData = {
        ...newRequest.data,
        userId: req.user.id
      }
      const request = await Request.create(requestData)

      if (req.file) {
        const imageUrl = await uploadToCloudinary(req.file, 'requests')
        request.targetImage = imageUrl
        await request.save()
      }
      res.status(201).json(request)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Actualiza una petición, solo permitido para rol 'phantom_thief'.
   *
   * @param {number} id ID de la petición a actualizar.
   *
   * @throws {403} Si el rol del usuario no tiene permiso.
   * @throws {404} Si no se encuentra la petición.
   * @throws {400} Si el cambio de estado no es válido o datos no válidos.
   * @throws {500} Error interno del servidor.
   */
  static async update (req, res) {
    if (req.user.role !== 'phantom_thief') {
      return res.status(403).json({ code: 'forbidden' })
    }

    const { id } = req.params

    const request = await Request.findByPk(id)
    if (!request) {
      return res.status(404).json({ code: 'request_not_found' })
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ code: 'invalid_status_change' })
    }

    const updatedRequest = validateUpdatedRequest(req.body)

    if (!updatedRequest.success) {
      return res.status(400).json({ code: updatedRequest.error.issues[0].message })
    }

    try {
      await request.update(updatedRequest.data)
      res.status(200).json(request)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Elimina una petición, solo para usuarios con rol 'admin'.
   *
   * @param {number} id ID de la petición a eliminar.
   *
   * @throws {403} Si el usuario no es admin.
   * @throws {404} Si no se encuentra la petición.
   * @throws {500} Error interno del servidor.
   */
  static async delete (req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ code: 'forbidden' })
    }
    try {
      const { id } = req.params
      const request = await Request.findByPk(id)
      if (!request) {
        return res.status(404).json({ code: 'request_not_found' })
      }
      await request.destroy()
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Permite votar en una petición.
   *
   * @param {number} id ID de la petición.
   *
   * @throws {401} Si el usuario no está autenticado.
   * @throws {403} Si el rol del usuario está prohibido.
   * @throws {404} Si no se encuentra la petición.
   * @throws {400} Si los datos del voto no son válidos.
   * @throws {500} Error interno del servidor.
   */
  static async vote (req, res) {
    const { id } = req.params

    if (!req.user || !req.user.id) {
      return res.status(401).json({ code: 'unauthenticated' })
    }

    if (req.user.role === 'phantom_thief' || req.user.role === 'admin') {
      return res.status(403).json({ code: 'forbidden' })
    }

    const request = await Request.findByPk(id)
    if (!request) {
      return res.status(404).json({ code: 'request_not_found' })
    }

    const newRequestVote = validateRequestVote(req.body)

    if (!newRequestVote.success) {
      return res.status(400).json({ code: newRequestVote.error.issues[0].message })
    }

    try {
      let requestVote = await RequestVotes.findOne({ where: { requestId: id, userId: req.user.id } })
      if (requestVote) {
        if (requestVote.vote === newRequestVote.data.vote) {
          await requestVote.destroy()
        } else {
          await requestVote.update(newRequestVote.data)
        }
      } else {
        requestVote = await RequestVotes.create({
          ...newRequestVote.data,
          requestId: id,
          userId: req.user.id
        })
      }

      await request.update({ totalVotes: request.totalVotes + (newRequestVote.data.vote ? 1 : -1) })

      res.status(200).json(requestVote)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Obtiene el recuento de votos para todas las peticiones.
   *
   * @throws {500} Error interno del servidor.
   */
  static async getRequestsVotes (req, res) {
    try {
      const requests = await Request.findAll({ attributes: ['id'] })
      if (!requests || requests.length === 0) {
        return res.status(200).json([])
      }

      const results = await Promise.all(
        requests.map(async (request) => {
          const [upvotes, downvotes] = await Promise.all([
            RequestVotes.count({ where: { requestId: request.id, vote: true } }),
            RequestVotes.count({ where: { requestId: request.id, vote: false } })
          ])

          const totalVotes = upvotes - downvotes

          return {
            requestId: request.id,
            upvotes,
            downvotes,
            totalVotes
          }
        })
      )

      res.status(200).json(results)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Obtiene los votos del usuario autenticado para peticiones.
   *
   * @throws {401} Si el usuario no está autenticado.
   * @throws {500} Error interno del servidor.
   */
  static async getUserRequestsVotes (req, res) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ code: 'unauthorized' })
    }

    try {
      const requestsVotes = await RequestVotes.findAll({
        attributes: ['requestId', 'vote', 'userId'],
        where: { userId: req.user.id }
      })

      res.status(200).json(requestsVotes)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }
}
