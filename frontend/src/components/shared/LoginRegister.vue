<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useRouter } from 'vue-router'
import AppInput from '../ui/AppInput.vue'
import AppButton from '../ui/AppButton.vue'

const authStore = useAuthStore()
const router = useRouter()

const isLoginMode = ref(true)
const form = ref({
  username: '',
  password: '',
})
const confirmPassword = ref('')

watch(isLoginMode, () => {
  authStore.error = null
})

const handleSubmit = async () => {
  if (!isLoginMode.value && form.value.password !== confirmPassword.value) {
    authStore.error = 'Passwords do not match'
    return
  }

  try {
    if (isLoginMode.value) {
      await authStore.login(form.value)
    } else {
      await authStore.register(form.value)
      await authStore.login(form.value)
    }

    const redirect = router.currentRoute.value.query.redirect || '/'
    router.push(redirect)
  } catch (error) {
    console.log(error)
  }
}
</script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
      <div class="flex justify-center items-center">
        <img src="../../assets/logo.svg" alt="Simple Kanban" />
      </div>
      <div class="flex border-b border-gray-200">
        <button
          @click="isLoginMode = true"
          :class="[
            'flex-1 py-2 px-4 font-medium text-sm focus:outline-none',
            isLoginMode
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          Login
        </button>
        <button
          @click="isLoginMode = false"
          :class="[
            'flex-1 py-2 px-4 font-medium text-sm focus:outline-none',
            !isLoginMode
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700',
          ]"
        >
          Register
        </button>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <AppInput
            label="Username"
            inputType="input"
            placeHolder="Your Username"
            required
            v-model="form.username"
          />
          <AppInput
            label="Password"
            inputType="input"
            type="password"
            placeHolder="Your Password"
            required
            v-model="form.password"
          />
          <div v-if="!isLoginMode">
            <AppInput
              label="Confirm Password"
              inputType="input"
              type="password"
              placeHolder="Confirm Your Password"
              required
              v-model="confirmPassword"
            />
          </div>
        </div>
        <div v-if="authStore.error" class="text-red-500 text-sm text-center">
          {{ authStore.error }}
        </div>
        <div>
          <AppButton
            :title="isLoginMode ? 'Sign In' : 'Register'"
            type="submit"
            btnClass="primary"
            :isLoading="authStore.isLoading"
            :disabled="authStore.isLoading"
          />
        </div>
      </form>
    </div>
  </div>
</template>
