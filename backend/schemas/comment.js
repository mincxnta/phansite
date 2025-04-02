import z from 'zod'

const commentSchema = z.object({
  // TODO Añadir esto a todos los schemas
  text: z.string().min(1, { message: 'empty_comment' }),
  anonymous: z.boolean().default(false)
})

export function validateComment (comment) {
  return commentSchema.safeParse(comment)
}
