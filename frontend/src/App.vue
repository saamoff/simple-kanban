<script setup>
import { useAuthStore } from './stores/authStore'
import { useRouter } from 'vue-router'
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/vue/24/outline'
import AppButton from './components/ui/AppButton.vue'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-sm" v-if="authStore.isAuthenticated">
      <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <img src="./assets/logo.svg" alt="Simple Kanban" />
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-500 hidden sm:block text-center"
            >Logged in as
            <span class="text-blue-500 hover:underline">{{ authStore.user?.username }}</span></span
          >
          <AppButton
            title="Logout"
            :icon="ArrowLeftEndOnRectangleIcon"
            btnClass="red-outline"
            @click="handleLogout"
          />
        </div>
      </div>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>
