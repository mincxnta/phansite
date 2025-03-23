import { Router } from 'express'
import { AdminController } from '../controllers/admin.js'

export const adminRouter = Router()

adminRouter.post('/create', AdminController.create)
