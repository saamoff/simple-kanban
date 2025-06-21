import { defineStore } from 'pinia'
import api from '../services/api.js'
import type { Task } from '../types/task'
import type { Collaborator } from '../types/collaborator.js'

interface TaskState {
  tasks: Task[]
  currentTask: Task | null
  isLoading: boolean
  error: string | null
  filters: {
    project?: string | null
    collaborator: string | null
  }
}

export const useTaskStore = defineStore('task', {
  state: (): TaskState => ({
    tasks: [],
    currentTask: null,
    isLoading: false,
    error: null,
    filters: {
      project: null,
      collaborator: null,
    },
  }),

  actions: {
    async fetchTasks(projectId?: string) {
      this.isLoading = true
      try {
        const response = projectId
          ? await api.projects.getProjectTasks(projectId)
          : await api.tasks.getTasks()
        this.tasks = response.data
      } catch (err) {
        this.error = err.message || 'Failed to fetch tasks'
      } finally {
        this.isLoading = false
      }
    },

    async fetchTask(id: string) {
      this.isLoading = true
      try {
        const response = await api.tasks.getTask(id)
        this.currentTask = response.data
      } catch (err) {
        this.error = err.message || 'Failed to fetch task'
      } finally {
        this.isLoading = false
      }
    },

    async createTask(taskData) {
      this.isLoading = true
      try {
        const response = await api.tasks.createTask(taskData)

        if (!response?.data?._id) {
          throw new Error('Invalid response format from server')
        }

        const newTask = {
          ...response.data,
          collaborators: [],
        }
        this.tasks.push(newTask)
        return {
          data: newTask,
          status: response.status,
          headers: response.headers,
        }
      } catch (err) {
        console.error('Error in createTask:', {
          message: err.message,
          config: err.config,
          response: err.response?.data,
        })
        this.error = err.message || 'Failed to create task'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateTask(id: string, updateData: Partial<Task>) {
      this.isLoading = true
      try {
        const response = await api.tasks.updateTask(id, updateData)
        const index = this.tasks.findIndex((t) => t._id === id)
        if (index !== -1) {
          this.tasks[index] = response.data
        }
        if (this.currentTask?._id === id) {
          this.currentTask = response.data
        }
        return response.data
      } catch (err) {
        this.error = err.message || 'Failed to update task'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateTaskStatus(taskId: string, newStatus: string) {
      try {
        const response = await api.tasks.updateTaskStatus(taskId, {
          status: newStatus,
        })
        const index = this.tasks.findIndex((t) => t._id === taskId)
        if (index !== -1) {
          this.tasks[index].status = newStatus
        }
        return response.data
      } catch (error) {
        console.error('Error updating task status:', {
          error: error.response?.data || error.message,
          taskId,
          newStatus,
        })
        throw error
      }
    },

    async deleteTask(id: string) {
      this.isLoading = true
      try {
        await api.tasks.deleteTask(id)
        this.tasks = this.tasks.filter((t) => t._id !== id)
        if (this.currentTask?._id === id) {
          this.currentTask = null
        }
      } catch (err) {
        this.error = err.message || 'Failed to delete task'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async addCollaborator(taskId: string, collaboratorIds: string[]) {
      try {
        await api.tasks.associateCollaborator(taskId, collaboratorIds)
        const task = this.tasks.find((t) => t._id === taskId)
        if (task) {
          task.collaborators = Array.from(new Set([...task.collaborators, ...collaboratorIds]))
        }
      } catch (err) {
        console.error(`Failed to add collaborators:`, err)
        throw err
      }
    },

    async removeCollaborator(taskId, collaboratorId) {
      try {
        const response = await api.tasks.deleteCollaborator(taskId, collaboratorId)
        return response.data
      } catch (error) {
        throw error
      }
    },

    setFilters(filters: { project?: string | null; collaborator?: string | null }) {
      if (filters.project !== undefined) {
        this.filters.project = filters.project
      }
      if (filters.collaborator !== undefined) {
        this.filters.collaborator = filters.collaborator
      }
    },
  },
  getters: {
    filteredTasks: (state) => {
      let filtered = state.tasks
      if (state.filters.project) {
        filtered = filtered.filter((task) => task.project === state.filters.project)
      }

      if (state.filters.collaborator) {
        filtered = filtered.filter((task) => {
          return task.collaborators?.some((collab: string | Collaborator) => {
            const collaboratorId = typeof collab === 'string' ? collab : collab._id
            return collaboratorId === state.filters.collaborator
          })
        })
      }

      return filtered
    },
    getTasksByStatus: (state) => (status: Task['status']) => {
      return state.tasks.filter((task) => task.status === status)
    },
    getTaskById: (state) => (id: string) => {
      return state.tasks.find((task) => task._id === id)
    },
  },
})
