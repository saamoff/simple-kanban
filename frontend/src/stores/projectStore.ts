// stores/project.ts
import { defineStore } from 'pinia'
import api from "../services/api.js"
import type { Project } from '../types/project.ts'

interface ProjectState {
  projects: Project[]
  isLoading: boolean
  error: string | null
}

export const useProjectStore = defineStore('project', {
  state: (): ProjectState => ({
    projects: [],
    isLoading: false,
    error: null
  }),

  actions: {
    async fetchProjects() {
      this.isLoading = true
      try {
        const response = await api.projects.getProjects()
        this.projects = response.data
      } catch (err) {
        this.error = err.message || 'Failed to fetch projects'
      } finally {
        this.isLoading = false
      }
    },

    async fetchProjectWithTasks(id: string) {
      this.isLoading = true
      try {
        const [projectRes, tasksRes] = await Promise.all([
          api.projects.getProject(id),
          api.projects.getProjectTasks(id)
        ])
        
        const project = projectRes.data
        project.tasks = tasksRes.data
        
        const index = this.projects.findIndex(p => p._id === id)
        if (index !== -1) {
          this.projects[index] = project
        } else {
          this.projects.push(project)
        }
        
        return project
      } catch (err) {
        this.error = err.message || 'Failed to fetch project with tasks'
        throw err
      } finally {
        this.isLoading = false
      }
    }
  },

  getters: {
    getProjectById: (state) => (id: string) => {
      return state.projects.find(project => project._id === id)
    }
  }
})