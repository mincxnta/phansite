import z from 'zod'

const pollSchema = z.object({
  question: z.string().min(1).max(100),
  isActive: z.boolean().default(true)
})

export function validatePoll (poll) {
  return pollSchema.safeParse(poll)
}

export function validateUpdatedPoll (poll) {
  return pollSchema.partial().safeParse(poll)
}
