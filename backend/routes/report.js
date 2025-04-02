import { Router } from 'express'
import { ReportController } from '../controllers/report.js'

export const reportsRouter = Router()

reportsRouter.get('/', ReportController.getAll)

reportsRouter.get('/:type', ReportController.getAllByType)

reportsRouter.post('/', ReportController.create)

reportsRouter.delete('/delete/:id', ReportController.deleteReport)
