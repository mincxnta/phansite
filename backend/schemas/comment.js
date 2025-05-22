import z from 'zod'

const commentSchema = z.object({
  text: z.string().trim().min(1, { message: 'empty_comment' }).max(1000, { message: 'comment_too_long' }),
  anonymous: z.boolean().default(false)
})

export function validateComment (comment) {
  return commentSchema.safeParse(comment)
}
