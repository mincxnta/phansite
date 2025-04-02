import { Router } from 'express'
import { CommentController } from '../controllers/comments.js'
import { authenticateToken } from '../middlewares/auth.js'

export const commentsRouter = Router()

commentsRouter.get('/:pollId', CommentController.getAll)

commentsRouter.post('/:pollId', authenticateToken, CommentController.create)

commentsRouter.delete('/:id', authenticateToken, CommentController.delete)
