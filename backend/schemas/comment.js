import z from 'zod'

const commentSchema = z.object({
  // Arreglar esto { message: 'empty_comment' }
  text: z.string().min(1),
  anonymous: z.boolean().default(false)
})

export function validateComment (comment) {
  return commentSchema.safeParse(comment)
}
