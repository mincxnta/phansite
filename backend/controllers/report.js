import { Report } from '../models/report.js'
import { validateReport } from '../schemas/report.js'

export class ReportController {
    static async create(req, res) {
        const newReport = validateReport(req.body)

        if (!newReport.success) {
            return res.status(400).send({ message: JSON.parse(newReport.error.message) })
        }

        try {
            const { reportedType, postId } = req.body
            const reportData = {
                ...newReport.data,
                userId: req.user.id,
                ...(reportedType === 'comment'
                    ? { commentId: postId }
                    : { requestId: postId })
            }
            const report = await Report.create(reportData)
            res.status(201).json(report)
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }


    static async getAll(req, res) {
        try {
            const requests = await Report.findAll({
                order: [['id', 'ASC']]
            })
            res.status(200).json(requests)
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    }
}