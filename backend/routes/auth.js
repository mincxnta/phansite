import { Router } from 'express'
import { AuthController } from '../controllers/auth.js'
import { loadUserFromToken } from '../middlewares/auth.js'

export const authRouter = Router()

authRouter.post('/login', AuthController.login)

authRouter.get('/user', loadUserFromToken, AuthController.getUser)

authRouter.post('/register', AuthController.register)

authRouter.post('/logout', AuthController.logout)

authRouter.post('/verify', AuthController.verifyEmail)

authRouter.post('/resend', AuthController.resendVerificationEmail)

authRouter.post('/forgot-password', AuthController.forgotPassword)

authRouter.post('/reset-password', AuthController.resetPassword)
