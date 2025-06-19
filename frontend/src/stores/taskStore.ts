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

    async createTask(taskData: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) {
      this.isLoading = true
      try {
        const payload = {
          title: taskData.title || '',
          description: taskData.description || '',
          project: taskData.project || null,
          collaborators: Array.isArray(taskData.collaborators) ? [...taskData.collaborators] : [],
        }

        const response = await api.tasks.createTask(payload)
        this.tasks.push(response.data)
        return response.data
      } catch (err) {
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

    async addCollaborator(taskId: string, collaboratorId: string) {
      try {
        await api.tasks.associateCollaborator(taskId, collaboratorId)
        const task = this.tasks.find((t) => t._id === taskId)
        if (task && !task.collaborators.includes(collaboratorId)) {
          task.collaborators.push(collaboratorId)
        }
      } catch (err) {
        this.error = err.message || 'Failed to add collaborator'
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
