import { defineStore } from 'pinia'
import api from '../services/api.js'
import type { Collaborator } from '../types/collaborator.ts'

interface CollaboratorState {
  collaborators: Collaborator[]
  isLoading: boolean
  name: String
}

export const useCollaboratorStore = defineStore('collaborator', {
  state: (): CollaboratorState => ({
    collaborators: [],
    isLoading: false,
    name: '',
  }),

  actions: {
    async fetchCollaborators() {
      this.isLoading = true
      try {
        const response = await api.collaborators.getCollaborators()
        this.collaborators = response.data
      } catch (err: any) {
        console.error(err.message || 'Failed to fetch collaborators')
      } finally {
        this.isLoading = false
      }
    },
  },

  getters: {
    getCollaboratorById: (state: CollaboratorState) => (id: string) => {
      return state.collaborators.find((collaborator: Collaborator) => collaborator._id === id)
    },
  },
})
