import { ref } from 'vue'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'
import { userService } from '../services/userService'
import { type UploadAvatarResponse } from '../types/user'

export function useUploadAvatar() {
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function uploadAvatar(file: File): Promise<UploadAvatarResponse | null> {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      const res = await userService.uploadAvatar(file)
      return res.data
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<UploadAvatarResponse>>(error)) {
        errorMessage.value = error.response?.data.message ?? 'Failed to upload avatar.'
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

  return { isLoading, errorMessage, errors, uploadAvatar }
}
