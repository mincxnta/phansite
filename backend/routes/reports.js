import { Router } from 'express'
import { ReportController } from '../controllers/reports.js'

export const reportsRouter = Router()

reportsRouter.post('/', ReportController.create)

reportsRouter.get('/', ReportController.getAllByType)

reportsRouter.delete('/:id', ReportController.delete)
