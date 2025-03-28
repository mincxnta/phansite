import { Poll } from '../models/poll.js'
import { Comment } from '../models/comment.js'
import { User } from '../models/user.js'
import { validateComment } from '../schemas/comment.js'

export class CommentController {
  static async getComments (req, res) {
    const { pollId } = req.params
    const page = parseInt(req.query.page) || 1 // Página por defecto
    const limit = parseInt(req.query.limit) || 5 // Comentarios por página
    const offset = (page - 1) * limit
    try {
      const poll = await Poll.findByPk(pollId)
      if (!poll) {
        return res.status(404).send({ message: 'Encuesta no encontrada' })
      }

      const { count, rows } = await Comment.findAndCountAll({
        where: { pollId },
        include: [
          {
            model: User,
            as: 'user', // Especifiquem l'àlies definit a la relació
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
      console.error('Error al obtenir els comentaris:', error)
      res.status(500).send({ message: error.message })
    }
  }

  static async addComment (req, res) {
    const { pollId } = req.params
    const newComment = validateComment(req.body)

    if (!newComment.success) {
      return res.status(400).send({ message: JSON.parse(newComment.error.message) })
    }

    try {
      const commentData = {
        ...newComment.data,
        userId: req.user.id,
        pollId
      }
      const comment = await Comment.create(commentData)
      res.status(201).json(comment)
    } catch (error) {
      res.status(500).send({ message: error.message })
    }
  }
}
