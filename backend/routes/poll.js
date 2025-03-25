import { Router } from 'express'
import { PollController } from '../controllers/polls.js'

export const pollsRouter = Router()

pollsRouter.get('/', PollController.getAll)

pollsRouter.get('/active', PollController.getActivePoll)

pollsRouter.post('/', PollController.create)

pollsRouter.patch('/:id', PollController.update)

pollsRouter.patch('/:id/vote', PollController.vote)
