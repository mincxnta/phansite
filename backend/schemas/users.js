import z from 'zod'

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string(),
  profile_picture: z.string().url().endsWith('.jpg'),
  role: z.array(
    z.enum(['admin', 'phantom_thief', 'fan'])
  ),
  registration_date: z.date()
})

export function validateNewUser (user) {
  return userSchema.safeParse(user)
}

export function validateUpdatedUser (user) {
  return userSchema.partial().safeParse(user)
}
