import { Router } from 'express'
import { PollController } from '../controllers/polls.js'
import { authenticateToken } from '../middlewares/auth.js'

export const pollsRouter = Router()

pollsRouter.get('/', PollController.getAll)

pollsRouter.get('/active', PollController.getActivePoll)

pollsRouter.post('/', authenticateToken, PollController.create)

pollsRouter.post('/:id/vote', authenticateToken, PollController.vote)

pollsRouter.get('/:id/results', PollController.getPollResults)

pollsRouter.get('/:id/user-vote', authenticateToken, PollController.getUserVote)
