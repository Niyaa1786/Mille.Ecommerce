<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useLogin } from '../composables/useLogin'
import { loginSchema, type LoginRequest } from '../types/auth'

const { isLoading, errorMessage, errors, handleLogin } = useLogin()

const form = useForm({
  defaultValues: {
    email: '',
    password: '',
  } as LoginRequest,
  validators: {
    onSubmit: loginSchema,
  },
  onSubmit: async ({ value }) => {
    await handleLogin(value)
  },
})
</script>

<template>
  <Card class="w-full max-w-sm">
    <CardHeader>
      <CardTitle class="text-center text-xl font-bold">Login</CardTitle>
      <CardDescription class="text-center text-md">Enter credentials to continue.</CardDescription>
    </CardHeader>
    <CardContent>
      <form class="flex flex-col gap-4" @submit.prevent.stop="form.handleSubmit">
        <form.Field name="email">
          <template #default="{ field, state }">
            <div class="space-y-1">
              <Label :for="field.name">Email</Label>
              <Input
                :id="field.name"
                :name="field.name"
                :model-value="field.state.value"
                @update:model-value="(v) => field.handleChange(String(v))"
                @blur="field.handleBlur"
                type="email"
                placeholder="john@gmail.com"
              />
              <p v-if="state.meta.errors.length" class="text-sm text-destructive">
                {{
                  typeof state.meta.errors[0] === 'object'
                    ? state.meta.errors[0]?.message
                    : state.meta.errors[0]
                }}
              </p>
            </div>
          </template>
        </form.Field>

        <form.Field name="password">
          <template #default="{ field, state }">
            <div class="space-y-1">
              <Label :for="field.name">Password</Label>
              <Input
                :id="field.name"
                :name="field.name"
                :model-value="field.state.value"
                @update:model-value="(v) => field.handleChange(String(v))"
                @blur="field.handleBlur"
                type="password"
                placeholder="Password"
              />
              <p v-if="state.meta.errors.length" class="text-sm text-destructive">
                {{
                  typeof state.meta.errors[0] === 'object'
                    ? state.meta.errors[0]?.message
                    : state.meta.errors[0]
                }}
              </p>
            </div>
          </template>
        </form.Field>

        <form.Subscribe>
          <template #default="{ canSubmit }">
            <Button type="submit" class="w-full" :disabled="!canSubmit || isLoading">
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </Button>
          </template>
        </form.Subscribe>

        <div v-if="errors.length" class="text-destructive text-md">
          <span v-for="(err, idx) in errors" :key="idx">{{ err }}</span>
        </div>

        <p class="text-center text-sm text-muted-foreground">
          Don't have account?
          <RouterLink to="/register" class="underline underline-offset-4">Sign up</RouterLink>
        </p>
      </form>
    </CardContent>
  </Card>
</template>
