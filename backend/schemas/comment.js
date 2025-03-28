import z from 'zod'

const commentSchema = z.object({
  text: z.string(),
  anonymous: z.boolean().default(false)
})

export function validateComment (comment) {
  return commentSchema.safeParse(comment)
}
