import { defineStore } from 'pinia'
import api from '../services/api.js'

interface User {
  id: string
  username: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  }),

  actions: {
    async initialize() {
      if (this.token) {
        try {
          await this.validateToken()
        } catch (error) {
          this.logout()
        }
      }
    },
    async login(credentials: { username: string; password: string }) {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.UserService.login(credentials)
        this.user = response.data.user
        this.token = response.data.token
        this.isAuthenticated = true
        localStorage.setItem('token', response.data.token)

        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Login failed'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async register(userData: { username: string; password: string }) {
      this.isLoading = true
      this.error = null
      try {
        const response = await api.UserService.register(userData)
        return response.data
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Registration failed'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async validateToken() {
      if (!this.token) {
        this.isAuthenticated = false
        return false
      }

      this.isLoading = true
      try {
        const response = await api.UserService.validateToken()
        this.user = response.data.user
        this.isAuthenticated = true
        return true
      } catch (error) {
        this.logout()
        return false
      } finally {
        this.isLoading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
    },
  },

  getters: {
    currentUser: (state) => state.user,
    authError: (state) => state.error,
    loading: (state) => state.isLoading,
  },
})
