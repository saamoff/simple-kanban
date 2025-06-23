<script setup>
import { ref, watch, computed } from 'vue'
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
const validationErrors = ref({
  username: '',
  password: '',
  confirmPassword: '',
})
const touchedFields = ref({
  username: false,
  password: false,
  confirmPassword: false,
})


const isFormValid = computed(() => {
  const hasUsername =
    form.value.username.trim().length >= 3 &&
    form.value.username.length <= 20 &&
    /^[a-z0-9]+$/.test(form.value.username)
  const hasValidPassword = form.value.password.length >= 8

  if (isLoginMode.value) {
    return hasUsername && hasValidPassword
  } else {
    const passwordsMatch = form.value.password === confirmPassword.value
    return hasUsername && hasValidPassword && passwordsMatch
  }
})

watch(isLoginMode, () => {
  authStore.error = null
  clearValidationErrors()
})

watch(() => form.value.username, (newVal) => {
  touchedFields.value.username = true
  validateForm('username', newVal)
})

watch(() => form.value.password, (newVal) => {
  touchedFields.value.password = true
  validateForm('password', newVal)
  if (!isLoginMode.value) {
    validateForm('confirmPassword', confirmPassword.value)
  }
})

watch(confirmPassword, (newVal) => {
  touchedFields.value.confirmPassword = true
  validateForm('confirmPassword', newVal)
})

const clearValidationErrors = () => {
  validationErrors.value = {
    username: '',
    password: '',
    confirmPassword: '',
  }
}

const clearFields = () => {
  form.value.username = ''
  form.value.password = ''
  confirmPassword.value = ''
}

const validateForm = () => {
  let isValid = true
  clearValidationErrors()

  if (!form.value.username.trim()) {
    validationErrors.value.username = 'Username is required'
    isValid = false
  } else if (form.value.username.length < 3) {
    validationErrors.value.username = 'Username must be at least 3 characters'
    isValid = false
  } else if (form.value.username.length > 20) {
    validationErrors.value.username = 'Username cannot exceed 20 characters'
    isValid = false
  } else if (!/^[a-z0-9]+$/.test(form.value.username)) {
    validationErrors.value.username = 'Only lowercase letters and numbers allowed'
    isValid = false
  }

  if (!form.value.password) {
    validationErrors.value.password = 'Password is required'
    isValid = false
  } else if (form.value.password.length < 8) {
    validationErrors.value.password = 'Password must be at least 8 characters'
    isValid = false
  }

  if (!isLoginMode.value) {
    if (!confirmPassword.value) {
      validationErrors.value.confirmPassword = 'Please confirm your password'
      isValid = false
    } else if (form.value.password !== confirmPassword.value) {
      validationErrors.value.confirmPassword = 'Passwords do not match'
      isValid = false
    }
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
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
    console.error(error)
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
          @click="
            () => {
              isLoginMode = true
              clearFields()
            }
          "
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
          @click="
            () => {
              isLoginMode = false
              clearFields()
            }
          "
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
          <div>
            <AppInput
              label="Username"
              inputType="input"
              :placeHolder="isLoginMode ? 'Your Username' : 'Username (3-20 lowercase characters)'"
              required
              v-model="form.username"
              @input="form.username = form.username.toLowerCase().replace(/[^a-z0-9]/g, '')"
            />
            <transition name="fade">
              <p v-if="validationErrors.username && touchedFields.username"
                 class="text-red-500 text-xs mt-1 transition-all duration-200">
                {{ validationErrors.username }}
              </p>
            </transition>
          </div>
          <div>
            <AppInput
              label="Password"
              inputType="input"
              type="password"
              :placeHolder="isLoginMode ? 'Your Password' : 'Password (At Least 8 Characters)'"
              required
              v-model="form.password"
            />
            <transition name="fade">
              <p v-if="validationErrors.password && touchedFields.password"
                 class="text-red-500 text-xs mt-1 transition-all duration-200">
                {{ validationErrors.password }}
              </p>
            </transition>
          </div>
          <div v-if="!isLoginMode">
            <AppInput
              label="Confirm Password"
              inputType="input"
              type="password"
              placeHolder="Confirm Your Password"
              required
              v-model="confirmPassword"
            />
            <transition name="fade">
              <p v-if="validationErrors.confirmPassword && touchedFields.confirmPassword"
                 class="text-red-500 text-xs mt-1 transition-all duration-200">
                {{ validationErrors.confirmPassword }}
              </p>
            </transition>
          </div>
        </div>
        <div v-if="authStore.error" class="p-3 bg-red-50 text-red-600 text-sm rounded-md">
          {{ authStore.error }}
        </div>
        <div
          v-if="!isLoginMode && authStore.success"
          class="p-3 bg-green-50 text-green-600 text-sm rounded-md"
        >
          {{ authStore.success }}
        </div>
        <div>
          <AppButton
            :title="isLoginMode ? 'Sign In' : 'Register'"
            type="submit"
            btnClass="primary"
            :isLoading="authStore.isLoading"
            :disabled="authStore.isLoading || !isFormValid"
          />
        </div>
        <div v-if="isLoginMode" class="text-center text-sm text-gray-500">
          Don't have an account?
          <button
            @click="
              () => {
                isLoginMode = false
                clearFields()
              }
            "
            class="text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            Register here
          </button>
        </div>
        <div v-else class="text-center text-sm text-gray-500">
          Already have an account?
          <button
            @click="
              () => {
                isLoginMode = true
                clearFields()
              }
            "
            class="text-blue-500 hover:text-blue-700 focus:outline-none"
          >
            Login here
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
