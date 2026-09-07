<template>
  <div class="rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
    <div class="w-full max-w-md space-y-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold">Mille</h1>
        <h2 class="mt-2 text-3xl font-bold">Welcome back</h2>
        <p class="mt-2 text-sm text-gray-500">Enter your credentials to access your account</p>
      </div>

      <Form
        v-slot="$formState"
        :initial-values="form"
        :resolver="zodResolver(loginSchema)"
        :validate-on-submit="true"
        @submit="onSubmit"
        class="flex flex-col gap-4"
      >
        <div class="flex flex-col gap-1">
          <InputText v-model="form.email" name="email" type="text" placeholder="Email" fluid />
          <Message
            v-if="$formState.email?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $formState.email.error?.message }}</Message
          >
        </div>

        <div class="flex flex-col gap-1">
          <InputPassword
            v-model="form.password"
            name="password"
            type="password"
            placeholder="Password"
            fluid
          />
          <Message
            v-if="$formState.password?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $formState.password.error?.message }}</Message
          >
        </div>

        <Button type="submit" variant="secondary" size="large" :disabled="isLoading">Login</Button>

        <div v-if="errors.length">
          <Message v-for="error in errors" severity="error" variant="simple">{{ error }}</Message>
        </div>

        <p class="text-center text-sm">
          Don't have an account?
          <RouterLink :to="{ name: 'Register' }" class="font-medium text-blue-600 hover:underline">
            Sign up
          </RouterLink>
        </p>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useLogin } from '../composables/useLogin'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { loginSchema } from '../types/auth'

const { form, isLoading, errorMessage, errors, handleLogin } = useLogin()

async function onSubmit(event: FormSubmitEvent) {
  if (event.valid) {
    await handleLogin()
  }
}
</script>

<style scoped></style>
