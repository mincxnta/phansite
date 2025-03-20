import { Router } from 'express'
import { RequestController } from '../controllers/requests.js'

export const requestsRouter = Router()

requestsRouter.get('/', RequestController.getAll)

requestsRouter.get('/:id', RequestController.getById)

requestsRouter.post('/', RequestController.create)

requestsRouter.patch('/:id', RequestController.update)

requestsRouter.delete('/:id', RequestController.delete)
