import z from 'zod'

const messageSchema = z.object({
  message: z.string().trim().max(2000, { message: 'message_too_long' }).optional().nullable()
})

export function validateMessage (message) {
  return messageSchema.safeParse(message)
}
