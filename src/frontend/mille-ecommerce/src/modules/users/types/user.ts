import z from 'zod'

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .nonempty('Full name is required')
    .max(100, 'Full name must not exceed 100 characters'),
  phone: z.string().max(20, 'Phone must not exceed 20 characters').optional(),
})

export const addAddressSchema = z.object({
  receiverName: z
    .string()
    .nonempty('Receiver name is required')
    .max(100, 'Receiver name must not exceed 100 characters'),
  receiverPhone: z
    .string()
    .nonempty('Receiver phone is required')
    .max(20, 'Receiver phone must not exceed 20 characters'),
  addressLine: z
    .string()
    .nonempty('Address line is required')
    .max(500, 'Address line must not exceed 500 characters'),
  isDefault: z.boolean(),
})

export const updateAddressSchema = addAddressSchema

export const uploadAvatarSchema = z.object({
  file: z.file(),
})

export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>
export type AddAddressRequest = z.infer<typeof addAddressSchema>
export type UpdateAddressRequest = z.infer<typeof updateAddressSchema>
export type UploadAvatarRequest = z.infer<typeof uploadAvatarSchema>

export type GetProfileResponse = UserProfileDto
export type UpdateProfileResponse = UserProfileDto

export type AddAddressResponse = {
  addressId: number
}

export type UpdateAddressResponse = {
  message: string
}

export type DeleteAddressResponse = {
  message: string
}

export type UploadAvatarResponse = {
  avatarUrl: string
}

export type AddressDto = {
  id: number
  receiverName: string
  receiverPhone: string
  addressLine: string
  isDefault: boolean
}

export type UserProfileDto = {
  id: string
  fullName: string
  email: string
  phone: string | null
  avatarUrl: string | null
  role: string
  addresses: AddressDto[]
}
