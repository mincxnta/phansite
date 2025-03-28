import { Router } from 'express'
import { ReportController } from '../controllers/report.js'

export const reportsRouter = Router()

//reportsRouter.get('/', ReportController.getAll)

reportsRouter.post('/', ReportController.create)