import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api.js'
import type { Collaborator } from '../types/collaborator.ts'

export const useCollaboratorStore = defineStore('collaborator', () => {
  const collaborators = ref<Collaborator[]>([])
  const isLoading = ref(false)
  const name = ref('')
  const error = ref<string | null>(null)

  const getCollaboratorById = computed(() => (id: string) => {
    return collaborators.value.find((collaborator: Collaborator) => collaborator._id === id)
  })

  async function fetchCollaborators() {
    isLoading.value = true
    try {
      const response = await api.collaborators.getCollaborators()
      collaborators.value = response.data
    } catch (error) {
      console.error(error.message || 'Failed to fetch collaborators')
    } finally {
      isLoading.value = false
    }
  }

  return {
    collaborators,
    isLoading,
    name,
    error,
    getCollaboratorById,
    fetchCollaborators,
  }
})
