import { Router } from 'express'
import { UserController } from '../controllers/users.js'
import { upload } from '../middlewares/upload.js'
import { authenticateToken } from '../middlewares/auth.js'

export const usersRouter = Router()

usersRouter.get('/', authenticateToken, UserController.getAll)

usersRouter.get('/fans', authenticateToken, UserController.getFans)

usersRouter.get('/:username', UserController.getByUsername)

usersRouter.patch('/update', authenticateToken, upload.single('profilePicture'), UserController.update)

usersRouter.patch('/ban/:id', authenticateToken, UserController.ban)
