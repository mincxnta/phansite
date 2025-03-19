import z from 'zod'

const userSchema = z.object({
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
  profile_picture: z.string().url().endsWith('.jpg').optional().nullable(),
  role: z.enum(['admin', 'phantom_thief', 'fan']),
  banned: z.boolean().default(false)
})

export function validateNewUser(user) {
  return userSchema.safeParse(user)
}

export function validateUpdatedUser(user) {
  return userSchema.partial().safeParse(user)
}
