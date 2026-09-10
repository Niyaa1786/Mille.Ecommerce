import { reactive, ref } from 'vue'
import type { ChangePassworRequest } from '../types/auth'
import { authService } from '../services/authService'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'

export function useChangePassword() {
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function handleChangePassword(data: ChangePassworRequest) {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      await authService.changePassword(data)
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<null>>(error)) {
        errorMessage.value = error.response?.data.message ?? 'Login Failed.'
        const errorList = error.response?.data.errors
        if (errorList && typeof errorList === 'object') {
          errors.value = Object.values(errorList).flat()
        }
      }
    } finally {
      isLoading.value = false
    }
  }
  return { handleChangePassword }
}
