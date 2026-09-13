import { ref } from 'vue'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'
import { userService } from '../services/userService'
import type { DeleteAddressResponse } from '../types/user'

export function useDeleteAddress() {
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function deleteAddress(id: number): Promise<boolean> {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      await userService.deleteAddress(id)
      return true
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<DeleteAddressResponse>>(error)) {
        errorMessage.value =
          error.response?.data.message ?? `Failed to delete address with ID: ${id}.`
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

  return { isLoading, errorMessage, errors, deleteAddress }
}
