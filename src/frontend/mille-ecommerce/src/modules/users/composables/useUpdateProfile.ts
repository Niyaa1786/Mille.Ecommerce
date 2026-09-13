import { ref } from 'vue'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'
import { userService } from '../services/userService'
import type { UpdateProfileRequest, UpdateProfileResponse } from '../types/user'

export function useUpdateProfile() {
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function updateProfile(data: UpdateProfileRequest): Promise<UpdateProfileResponse | null> {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      const res = await userService.updateProfile(data)
      return res.data
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<UpdateProfileResponse>>(error)) {
        errorMessage.value = error.response?.data.message ?? 'Failed to update profile.'
        const errorList = error.response?.data.errors
        if (errorList && typeof errorList === 'object') {
          errors.value = Object.values(errorList).flat()
        }
      }
      return null
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, errorMessage, errors, updateProfile }
}
