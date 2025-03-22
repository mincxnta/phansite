import { Router } from 'express'
import { UserController } from '../controllers/users.js'

export const usersRouter = Router()

usersRouter.get('/', UserController.getAll)

usersRouter.get('/profile', UserController.getById)

usersRouter.post('/', UserController.create)

usersRouter.patch('/profile', UserController.update)

usersRouter.patch('/:id/ban', UserController.ban)

usersRouter.delete('/profile', UserController.delete)
