import z from 'zod'

const requestSchema = z.object({
  title: z.string(),
  description: z.string(),
  target: z.string(),
  image: z.string().url().endsWith('.jpg').optional().nullable(),
  thiefComment: z.string().optional().nullable()
})

export function validateRequest(request) {
  return requestSchema.safeParse(request)
}

export function validateUpdatedRequest(request) {
  return requestSchema.partial().safeParse(request)
}
