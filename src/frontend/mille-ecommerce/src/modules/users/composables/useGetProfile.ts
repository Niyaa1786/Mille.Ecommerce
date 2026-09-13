import { ref } from 'vue'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'
import { userService } from '../services/userService'
import type { GetProfileResponse } from '../types/user'

export function useGetProfile() {
  const profile = ref<GetProfileResponse | null>(null)

  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function fetchProfile(): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      const res = await userService.getProfile()
      profile.value = res.data
      return true
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<GetProfileResponse>>(error)) {
        errorMessage.value =
          error.response?.data.message ?? 'Failed to load profile, please try again.'
        const errorList = error.response?.data.errors
        if (errorList && typeof errorList === 'object') {
          errors.value = Object.values(errorList).flat()
        }
      }
      return false
    } finally {
      isLoading.value = false
    }
  }

  return { profile, isLoading, errorMessage, errors, fetchProfile }
}
