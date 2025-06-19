import { defineStore } from 'pinia'
import api from '../services/api.js'
import type { Project } from '../types/project.ts'
import { useTaskStore } from './taskStore.js'

interface ProjectState {
  projects: Project[]
  currentProject: Project | null
  isLoading: boolean
  error: string | null
}

export const useProjectStore = defineStore('project', {
  state: (): ProjectState => ({
    projects: [],
    currentProject: null,
    isLoading: false,
    error: null,
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
          api.projects.getProjectTasks(id),
        ])

        const project = projectRes.data
        project.tasks = tasksRes.data

        const index = this.projects.findIndex((p) => p._id === id)
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
    },

    async createProject(projectData: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>) {
      this.isLoading = true
      try {
        const payload = {
          name: projectData.name || '',
        }
        const response = await api.projects.createProject(payload)
        this.projects.push(response.data)
        return response.data
      } catch (err) {
        this.error = err.message || 'Failed to create project'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateProject(id: string, updateData: Partial<Project>) {
      this.isLoading = true
      try {
        const response = await api.projects.updateProject(id, updateData)
        const index = this.projects.findIndex((p: Project) => p._id === id)
        if (index !== -1) {
          this.projects[index] = response.data
        }
        if (this.currentProject?._id === id) {
          this.currentProject = response.data
        }
        return response.data
      } catch (err) {
        this.error = err.message || 'Failed to update project'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async deleteProject(id: string) {
      this.isLoading = true
      try {
        await api.projects.deleteProject(id)
        this.projects = this.projects.filter((t) => t._id !== id)
        if (this.currentProject?._id === id) {
          this.currentProject = null
        }
      } catch (err) {
        this.error = err.message || 'Failed to delete project'
        throw err
      } finally {
        this.isLoading = false
      }
    },
  },

  getters: {
    getProjectById: (state) => (id: string) => {
      return state.projects.find((project) => project._id === id)
    },
  },
})
