import { Router } from 'express'
import { AuthController } from '../controllers/auth.js'
import { loadUserFromToken } from '../middlewares/auth.js'

export const authRouter = Router()

authRouter.post('/register', AuthController.register)

authRouter.post('/login', AuthController.login)

authRouter.get('/user', loadUserFromToken, AuthController.getUser)

authRouter.post('/logout', AuthController.logout)

authRouter.post('/refresh', AuthController.refresh)
