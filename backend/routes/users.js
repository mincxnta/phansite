import { Router } from 'express'
import { UserController } from '../controllers/users.js'
import { upload } from '../middlewares/upload.js'

export const usersRouter = Router()

usersRouter.get('/', UserController.getAll)

usersRouter.get('/:username', UserController.getByUsername)

usersRouter.patch('/update', upload.single('profilePicture'), UserController.update)

usersRouter.patch('/ban/:id', UserController.ban)

usersRouter.delete('/delete', UserController.delete)
