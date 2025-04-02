import { Router } from 'express'
import { UserController } from '../controllers/users.js'

export const usersRouter = Router()

usersRouter.get('/', UserController.getAll)

usersRouter.get('/me', UserController.getMe)

usersRouter.get('/:username', UserController.getById)

usersRouter.patch('/update', UserController.update)

usersRouter.patch('/ban/:id', UserController.ban)

usersRouter.delete('/delete', UserController.delete)
