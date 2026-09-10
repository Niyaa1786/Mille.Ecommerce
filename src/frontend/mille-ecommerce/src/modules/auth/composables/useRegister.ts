import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { reactive, ref } from 'vue'
import { type RegisterResponse, type RegisterRequest } from '../types/auth'
import { authService } from '../services/authService'
import axios from 'axios'
import { type ApiResponse } from '@/shared/types/api'

export function useRegister() {
  const router = useRouter()
  const authStore = useAuthStore()

  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function handleRegister(data: RegisterRequest) {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      const result = await authService.register(data)
      await router.push('/login')
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<RegisterResponse>>(error)) {
        errorMessage.value = error.response?.data.message ?? 'Register failed'
        const errorList = error.response?.data.errors
        if (errorList && typeof errorList === 'object') {
          errors.value = Object.values(errorList).flat()
        }
      }
    } finally {
      isLoading.value = false
    }
  }
  return { isLoading, errorMessage, errors, handleRegister }
}
