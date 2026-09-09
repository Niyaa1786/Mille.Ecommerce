import type { UserRole } from '@/shared/constants/user'
import z, { email } from 'zod'

export const registerSchema = z.object({
  fullName: z.string().nonempty('Fullname is required'),
  email: z.email('Invalid email format'),
  password: z
    .string()
    .nonempty('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  phone: z
    .string()
    .optional()
    .refine((val) => val == undefined || val.length <= 10, 'Phone number invalid '),
})

export const loginSchema = z.object({
  email: z.email('Invalid email format').nonempty('Email is required'),
  password: z.string().nonempty('Password is required'),
})

export const changePasswordSchema = z.object({
  oldPassword: z.string().nonempty('Current password is required'),

  newPassword: z
    .string()
    .nonempty('New password is required')
    .min(6, 'New password must be at least 6 characters')
    .max(100, 'New password must not exceed 100 characters'),
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
})

export type RegisterRequest = z.infer<typeof registerSchema>
export type LoginRequest = z.infer<typeof loginSchema>
export type ChangePassworRequest = z.infer<typeof changePasswordSchema>
export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>

export type LoginResponse = {
  accessToken: string
  refreshToken: string
  accessTokenExpiration: string
  refreshTokenExpiration: string
  user: {
    id: string
    email: string
    fullName: string
    role: UserRole
  }
}

export type RegisterResponse = {
  userId: string
  email: string
  fullName: string
}

export type RefreshTokenResponse = Omit<LoginResponse, 'user'>
