import { Router } from 'express'
import { RequestController } from '../controllers/requests.js'
import { authenticateToken } from '../middlewares/auth.js'

export const requestsRouter = Router()

requestsRouter.get('/', RequestController.getAll)

requestsRouter.get('/user', authenticateToken, RequestController.getAllByUser)

requestsRouter.get('/user-votes', authenticateToken, RequestController.getUserRequestsVotes)

requestsRouter.get('/votes', RequestController.getRequestsVotes)

requestsRouter.get('/:id', RequestController.getById)

requestsRouter.post('/', authenticateToken, RequestController.create)

// requestsRouter.patch('/:id', authenticateToken, RequestController.update)

requestsRouter.delete('/:id', authenticateToken, RequestController.delete)

requestsRouter.post('/:id/vote', authenticateToken, RequestController.vote)
