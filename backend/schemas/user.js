import z from 'zod'
import { ROLES } from '../constants/constants.js'

const userSchema = z.object({
  email: z.string().trim().min(1, { message: 'empty_email' }).email({ message: 'invalid_email' }).max(255, { message: 'email_too_long' }),
  username: z.string().trim().min(1, { message: 'empty_username' }).max(50, { message: 'username_too_long' }),
  password: z
    .string()
    .min(8, { message: 'password_too_short' })
    .max(255, { message: 'password_too_long' })
    .regex(/[A-Z]/, { message: 'password_missing_uppercase' })
    .regex(/[0-9]/, { message: 'password_missing_number' }),
  role: z.enum(ROLES).default(ROLES[2]),
  banned: z.boolean().default(false),
  aboutMe: z.string().trim().max(2000, { message: 'about_me_too_long' }).optional().nullable()
})

export function validateUser (user) {
  return userSchema.safeParse(user)
}

export function validateUpdatedUser (user) {
  return userSchema.partial().safeParse(user)
}
