import z from 'zod'

const pollSchema = z.object({
  questionEs: z.string().trim().min(1, { message: 'empty_question' }).max(100, { message: 'question_too_long' }),
  questionEn: z.string().trim().min(1, { message: 'empty_question' }).max(100, { message: 'question_too_long' }),
  isActive: z.boolean().default(true)
})

export function validatePoll (poll) {
  return pollSchema.safeParse(poll)
}

export function validateUpdatedPoll (poll) {
  return pollSchema.partial().safeParse(poll)
}
