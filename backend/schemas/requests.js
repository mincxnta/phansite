import z from 'zod'
import { STATUS } from '../constants/constants.js'

const requestSchema = z.object({
  title: z.string().trim().min(1, { message: 'empty_title' }).max(255, { message: 'title_too_long' }),
  description: z.string().trim().min(1, { message: 'empty_description' }).max(500, { message: 'description_too_long' }),
  target: z.string().trim().min(1, { message: 'empty_target' }).max(255, { message: 'target_too_long' }),
  status: z.enum(STATUS).default(STATUS[0]),
  thiefComment: z.string().trim().max(500, { message: 'comment_too_long' }).optional().nullable()
})

export function validateRequest (request) {
  return requestSchema.safeParse(request)
}

export function validateUpdatedRequest (request) {
  return requestSchema.partial().safeParse(request)
}
