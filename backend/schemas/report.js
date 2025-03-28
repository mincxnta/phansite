import z from 'zod'
import { REPORT_TYPE } from '../constants/constants.js'

const reportSchema = z.object({
    reason: z.string(),
    reportedType: z.enum(REPORT_TYPE)
})

export function validateReport(report) {
    return reportSchema.safeParse(report)
}