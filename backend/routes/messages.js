import { Router } from 'express'
import { MessageController } from '../controllers/messages.js'
import { upload } from '../middlewares/upload.js'

export const messagesRouter = Router()

messagesRouter.get('/users', MessageController.getUsers)

messagesRouter.get('/:id', MessageController.getMessages)

messagesRouter.post('/:id', upload.single('image'), MessageController.sendMessage)
