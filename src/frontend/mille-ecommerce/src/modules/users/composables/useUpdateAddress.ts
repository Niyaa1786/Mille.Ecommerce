import { ref } from 'vue'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'
import { userService } from '../services/userService'
import type { UpdateAddressRequest, UpdateAddressResponse } from '../types/user'

export function useUpdateAddress() {
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function updateAddress(id: number, data: UpdateAddressRequest): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      await userService.updateAddress(id, data)
      return true
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<UpdateAddressResponse>>(error)) {
        errorMessage.value =
          error.response?.data.message ?? `Failed to update address with ID: ${id}.`
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

  return { isLoading, errorMessage, errors, updateAddress }
}
