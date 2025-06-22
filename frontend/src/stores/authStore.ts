import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api.js'

interface User {
  id: string
  username: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref(localStorage.getItem('token') || null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isAuthenticated = ref(false)

  const currentUser = computed(() => user.value)
  const authError = computed(() => error.value)
  const loading = computed(() => isLoading.value)

  async function initialize() {
    if (token.value) {
      try {
        await validateToken()
      } catch (error) {
        logout()
      }
    }
  }

  async function login(credentials: { username: string; password: string }) {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.UserService.login(credentials)
      user.value = response.data.user
      token.value = response.data.token
      isAuthenticated.value = true
      localStorage.setItem('token', response.data.token)

      return response.data
    } catch (error: any) {
      error.value = error.response?.data?.message || 'Login failed'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function register(userData: { username: string; password: string }) {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.UserService.register(userData)
      return response.data
    } catch (error: any) {
      error.value = error.response?.data?.message || 'Registration failed'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function validateToken() {
    if (!token.value) {
      isAuthenticated.value = false
      return false
    }

    isLoading.value = true
    try {
      const response = await api.UserService.validateToken()
      user.value = response.data.user
      isAuthenticated.value = true
      return true
    } catch (error) {
      logout()
      return false
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    currentUser,
    authError,
    loading,
    initialize,
    login,
    register,
    validateToken,
    logout,
  }
})
