import z from 'zod'
import { REPORT_TYPE } from '../constants/constants.js'

const reportSchema = z.object({
  reason: z.string().trim().min(1, { message: 'empty_reason' }).max(500, { message: 'reason_too_long' }),
  reportedType: z.enum(REPORT_TYPE)
})

export function validateReport (report) {
  return reportSchema.safeParse(report)
}
