<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useRegister } from '../composables/useRegister'
import { registerSchema, type RegisterRequest } from '../types/auth'

const { isLoading, errorMessage, errors, handleRegister } = useRegister()

const form = useForm({
  defaultValues: {
    fullName: '',
    email: '',
    password: '',
    phone: '',
  } as RegisterRequest,
  validators: {
    onSubmit: registerSchema,
  },
  onSubmit: async ({ value }) => {
    const { ...data } = value
    await handleRegister(data)
  },
})
</script>

<template>
  <Card class="w-full max-w-xl">
    <CardHeader>
      <CardTitle class="text-center text-xl font-bold">Register</CardTitle>
      <CardDescription class="text-center text-md">Create new account!</CardDescription>
    </CardHeader>
    <CardContent>
      <form class="flex flex-col gap-4" @submit.prevent="form.handleSubmit">
        <form.Field name="fullName">
          <template #default="{ field, state }">
            <div class="space-y-1">
              <Label :for="field.name">Full Name</Label>
              <Input
                :id="field.name"
                :name="field.name"
                :model-value="field.state.value"
                @update:model-value="(v) => field.handleChange(String(v))"
                @blur="field.handleBlur"
                placeholder="John Doe"
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
                type="text"
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

        <form.Field name="phone">
          <template #default="{ field }">
            <div class="space-y-1">
              <Label :for="field.name">Phone (optional)</Label>
              <Input
                :id="field.name"
                :name="field.name"
                :model-value="field.state.value"
                @update:model-value="(v) => field.handleChange(String(v))"
                @blur="field.handleBlur"
                type="tel"
                placeholder="0987654321"
              />
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
                placeholder="password"
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
              {{ isLoading ? 'Registating...' : 'Register' }}
            </Button>
          </template>
        </form.Subscribe>

        <ul v-if="errors.length" class="text-sm text-destructive list-disc pl-4">
          <li v-for="(err, idx) in errors" :key="idx">{{ err }}</li>
        </ul>

        <p class="text-center text-sm text-muted-foreground">
          Already have account login?
          <RouterLink to="/login" class="underline underline-offset-4">Sign in</RouterLink>
        </p>
      </form>
    </CardContent>
  </Card>
</template>
