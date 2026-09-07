<template>
  <div class="rounded-xl p-6 shadow-sm transition-all hover:shadow-md max-w-340">
    <div class="w-full max-w-md space-y-6">
      <div class="text-center">
        <h1 class="text-2xl font-bold">Mille</h1>
        <h2 class="mt-2 text-3xl font-bold">Welcome back</h2>
        <p class="mt-2 text-sm text-gray-500">Enter your credentials to access your account</p>
      </div>

      <Form
        v-slot="$formState"
        :initial-values="form"
        :resolver="zodResolver(registerSchema)"
        :validate-on-submit="true"
        @submit="onSubmit"
        class="flex flex-col gap-4"
      >
        <div class="flex flex-col gap-1">
          <InputText
            v-model="form.fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            fluid
          />
          <Message
            v-if="$formState.fullName?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $formState.fullName.error?.message }}</Message
          >
        </div>

        <div class="flex flex-col gap-1">
          <InputText
            v-model="form.email"
            name="email"
            type="text"
            placeholder="john@gmail.com"
            fluid
          />
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

        <div class="flex flex-col gap-1">
          <InputText
            v-model="form.phone"
            name="phone"
            type="text"
            placeholder="+84 901 234 567 (Optional)"
            fluid
          />
          <Message
            v-if="$formState.phone?.invalid"
            severity="error"
            size="small"
            variant="simple"
            >{{ $formState.phone.error?.message }}</Message
          >
        </div>

        <Button type="submit" variant="secondary" size="large" :disabled="isLoading"
          >Sign up</Button
        >
      </Form>

      <div v-if="errors.length">
        <Message v-for="(error, index) in errors" :key="index" severity="error" variant="simple">
          {{ error }}
        </Message>
      </div>

      <p class="text-center text-sm">
        Already have an account?
        <RouterLink :to="{ name: 'Login' }" class="font-medium text-blue-600 hover:underline">
          Sign in
        </RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useRegister } from '../composables/useRegister'
import { registerSchema } from '../types/auth'
import type { FormSubmitEvent } from '@primevue/forms'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const { form, isLoading, errorMessage, errors, handleRegister } = useRegister()

async function onSubmit(event: FormSubmitEvent) {
  if (event.valid) {
    await handleRegister()
  }
}
</script>

<style scoped></style>
