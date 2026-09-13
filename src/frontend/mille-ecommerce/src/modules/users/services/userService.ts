import type { ApiResponse } from '@/shared/types/api'
import apiClient from '@/shared/services/axios'
import type {
  AddAddressRequest,
  AddAddressResponse,
  DeleteAddressResponse,
  GetProfileResponse,
  UpdateAddressRequest,
  UpdateAddressResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UploadAvatarResponse,
} from '../types/user'

const BASE_URL = '/api/Users'

export const userService = {
  async getProfile(): Promise<ApiResponse<GetProfileResponse>> {
    const res = await apiClient.get<ApiResponse<GetProfileResponse>>(`${BASE_URL}/profile`)
    return res.data
  },

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<UpdateProfileResponse>> {
    const res = await apiClient.put<ApiResponse<UpdateProfileResponse>>(`${BASE_URL}/profile`, data)
    return res.data
  },

  async addAddress(data: AddAddressRequest): Promise<ApiResponse<AddAddressResponse>> {
    const res = await apiClient.post<ApiResponse<AddAddressResponse>>(`${BASE_URL}/addresses`, data)
    return res.data
  },

  async updateAddress(
    id: number,
    data: UpdateAddressRequest,
  ): Promise<ApiResponse<UpdateAddressResponse>> {
    const res = await apiClient.put<ApiResponse<UpdateAddressResponse>>(
      `${BASE_URL}/addresses/${id}`,
      data,
    )
    return res.data
  },

  async deleteAddress(id: number): Promise<ApiResponse<DeleteAddressResponse>> {
    const res = await apiClient.delete<ApiResponse<DeleteAddressResponse>>(
      `${BASE_URL}/addresses/${id}`,
    )
    return res.data
  },

  async uploadAvatar(file: File): Promise<ApiResponse<UploadAvatarResponse>> {
    const formData = new FormData()
    formData.append('file', file)
    const res = await apiClient.post<ApiResponse<UploadAvatarResponse>>(
      `${BASE_URL}/avatar`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    return res.data
  },
}
