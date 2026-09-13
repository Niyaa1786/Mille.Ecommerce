import { ref } from 'vue'
import axios from 'axios'
import type { ApiResponse } from '@/shared/types/api'
import { userService } from '../services/userService'
import type { AddAddressRequest, AddAddressResponse } from '../types/user'

export function useAddAddress() {
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function addAddress(data: AddAddressRequest): Promise<AddAddressResponse | null> {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      const res = await userService.addAddress(data)
      return res.data
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<AddAddressResponse>>(error)) {
        errorMessage.value = error.response?.data.message ?? 'Failed to add address.'
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

  return { isLoading, errorMessage, errors, addAddress }
}
