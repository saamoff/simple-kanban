import { defineStore } from 'pinia'
import api from '../services/api.js'
import type { Task } from '../types/task'

interface TaskState {
  tasks: Task[]
  currentTask: Task | null
  isLoading: boolean
  error: string | null
}

export const useTaskStore = defineStore('task', {
  state: (): TaskState => ({
    tasks: [],
    currentTask: null,
    isLoading: false,
    error: null,
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
          task.collaborators = [...new Set([...task.collaborators, ...collaboratorIds])]
        }
      } catch (err) {
        console.error(`Failed to add collaborators:`, err)
        throw err
      }
    },
  },
  getters: {
    getTasksByStatus: (state) => (status: Task['status']) => {
      return state.tasks.filter((task) => task.status === status)
    },
    getTaskById: (state) => (id: string) => {
      return state.tasks.find((task) => task._id === id)
    },
  },
})
