<template>
  <div class="w-full max-w-md space-y-6">
    <div class="text-center">
      <h1 class="text-2xl font-bold">Mille</h1>
      <h2 class="mt-6 text-3xl font-bold">Welcome back</h2>
      <p class="mt-2 text-sm text-gray-500">Enter your credentials to access your account</p>
    </div>

    <p class="text-center text-sm">
      Don't have an account?
      <RouterLink :to="{ name: 'Register' }" class="font-medium text-blue-600 hover:underline">
        Sign up
      </RouterLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useLogin } from '../composables/useLogin'
const { form, isLoading, errorMessage, errors, handleLogin } = useLogin()
</script>

<style scoped></style>
