import { Poll } from '../models/poll.js'
import { Comment } from '../models/comment.js'
import { User } from '../models/user.js'
import { validateComment } from '../schemas/comment.js'

/**
 * Controlador para la gestión de comentarios en encuestas.
 */
export class CommentController {
  /**
   * Obtiene todos los comentarios de una encuesta paginados.
   *
   * @param {string} pollId - ID de la encuesta.
   * @param {number} page - Número de página.
   * @param {number} limit - Comentarios por página.
   *
   * @throws {404} Si la encuesta no existe.
   * @throws {500} Error interno del servidor.
   */
  static async getAll (req, res) {
    const { pollId } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit
    try {
      const poll = await Poll.findByPk(pollId)
      if (!poll) {
        return res.status(404).json({ code: 'poll_not_found' })
      }

      const { count, rows } = await Comment.findAndCountAll({
        where: { pollId },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'profilePicture', 'banned']
          }
        ],
        order: [['date', 'DESC']],
        limit,
        offset
      })

      res.status(200).json({
        comments: rows,
        totalComments: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      })
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Crea un nuevo comentario en una encuesta.
   *
   * @param {string} pollId - ID de la encuesta.
   *
   * @throws {401} Si no está autenticado.
   * @throws {403} Si el rol es 'phantom_thief' o 'admin'.
   * @throws {400} Datos inválidos.
   * @throws {404} Encuesta no encontrada.
   * @throws {500} Error interno del servidor.
   */
  static async create (req, res) {
    const { pollId } = req.params

    if (!req.user || !req.user.id) {
      return res.status(401).json({ code: 'unauthenticated' })
    }

    if (req.user.role === 'phantom_thief' || req.user.role === 'admin') {
      return res.status(403).json({ code: 'forbidden' })
    }

    const newComment = validateComment(req.body)

    if (!newComment.success) {
      return res.status(400).json({ code: newComment.error.issues[0].message })
    }

    try {
      const poll = await Poll.findByPk(pollId)
      if (!poll) {
        return res.status(404).json({ code: 'poll_not_found' })
      }

      const commentData = {
        ...newComment.data,
        userId: req.user.id,
        pollId
      }
      const comment = await Comment.create(commentData)
      res.status(201).json(comment)
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

  /**
   * Elimina un comentario por ID.
   *
   * @throws {403} Si no tiene rol de administrador.
   * @throws {404} Comentario no encontrado.
   * @throws {500} Error interno del servidor.
   */
  static async delete (req, res) {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ code: 'forbidden' })
    }
    try {
      const { id } = req.params
      const request = await Comment.findByPk(id)
      if (!request) {
        return res.status(404).json({ code: 'request_not_found' })
      }
      await request.destroy()
      res.status(200).json({ success: true })
    } catch (error) {
      res.status(500).json({ code: 'internal_server_error' })
    }
  }
}
