import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { reactive, ref } from 'vue'
import { type LoginRequest, type LoginResponse } from '../types/auth'
import type { ApiResponse } from '@/shared/types/api'
import axios from 'axios'

export function useLogin() {
  const router = useRouter()
  const authStore = useAuthStore()

  //Errors validate lấy từ BE :D
  const isLoading = ref<boolean>(false)
  const errorMessage = ref<string | null>(null)
  const errors = ref<string[]>([])

  async function handleLogin(data: LoginRequest) {
    isLoading.value = true
    errorMessage.value = null
    errors.value = []

    try {
      await authStore.login(data)
      await router.push('/')
    } catch (error) {
      if (axios.isAxiosError<ApiResponse<LoginResponse>>(error)) {
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

  return { isLoading, errorMessage, errors, handleLogin }
}
