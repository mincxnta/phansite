import { Poll } from '../models/poll.js'
import { Comment } from '../models/comment.js'
import { User } from '../models/user.js'
import { validateComment } from '../schemas/comment.js'

export class CommentController {
  static async getAll (req, res) {
    const { pollId } = req.params
    const page = parseInt(req.query.page) || 1 // Página por defecto
    const limit = parseInt(req.query.limit) || 5 // Comentarios por página
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
            attributes: ['username', 'profilePicture']
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

  static async create (req, res) {
    const { pollId } = req.params
    const newComment = validateComment(req.body)

    if (!newComment.success) {
      return res.status(400).json({ code: newComment.error.issues[0].message }) // TODO Hacer esto en todas las validaciones
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
      // if (error.name === 'SequelizeValidationError') {
      //   const errorCode = error.errors[0].message;
      //   return res.status(400).json({ code: errorCode });
      // }
      res.status(500).json({ code: 'internal_server_error' })
    }
  }

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
