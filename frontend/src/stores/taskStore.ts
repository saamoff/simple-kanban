import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api.js'
import type { Task } from '../types/task'
import type { Collaborator } from '../types/collaborator.js'

export const useTaskStore = defineStore('task', () => {
  const tasks = ref<Task[]>([])
  const currentTask = ref<Task | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref({
    project: null as string | null,
    collaborator: null as string | null,
  })

  const filteredTasks = computed(() => {
    let filtered = tasks.value
    if (filters.value.project) {
      filtered = filtered.filter((task) => task.project === filters.value.project)
    }

    if (filters.value.collaborator) {
      filtered = filtered.filter((task) => {
        return task.collaborators?.some((collab: string | Collaborator) => {
          const collaboratorId = typeof collab === 'string' ? collab : collab._id
          return collaboratorId === filters.value.collaborator
        })
      })
    }
    return filtered
  })

  const getTasksByStatus = computed(() => (status: Task['status']) => {
    return tasks.value.filter((task) => task.status === status)
  })

  const getTaskById = computed(() => (id: string) => {
    return tasks.value.find((task) => task._id === id)
  })

  async function fetchTasks(projectId?: string) {
    isLoading.value = true
    try {
      const response = projectId
        ? await api.projects.getProjectTasks(projectId)
        : await api.tasks.getTasks()
      tasks.value = response.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch tasks'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchTask(id: string) {
    isLoading.value = true
    try {
      const response = await api.tasks.getTask(id)
      currentTask.value = response.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch task'
    } finally {
      isLoading.value = false
    }
  }

  async function createTask(taskData: any) {
    isLoading.value = true
    try {
      const response = await api.tasks.createTask(taskData)

      if (!response?.data?._id) {
        throw new Error('Invalid response format from server')
      }

      const newTask = {
        ...response.data,
        collaborators: [],
      }
      tasks.value.push(newTask)
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
      error.value = err.message || 'Failed to create task'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateTask(id: string, updateData: Partial<Task>) {
    isLoading.value = true
    try {
      const response = await api.tasks.updateTask(id, updateData)
      const index = tasks.value.findIndex((t) => t._id === id)
      if (index !== -1) {
        tasks.value[index] = response.data
      }
      if (currentTask.value?._id === id) {
        currentTask.value = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to update task'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateTaskStatus(taskId: string, newStatus: string) {
    try {
      const response = await api.tasks.updateTaskStatus(taskId, {
        status: newStatus,
      })
      const index = tasks.value.findIndex((t) => t._id === taskId)
      if (index !== -1) {
        tasks.value[index].status = newStatus
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
  }

  async function deleteTask(id: string) {
    isLoading.value = true
    try {
      await api.tasks.deleteTask(id)
      tasks.value = tasks.value.filter((t) => t._id !== id)
      if (currentTask.value?._id === id) {
        currentTask.value = null
      }
    } catch (err) {
      error.value = err.message || 'Failed to delete task'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function addCollaborator(taskId: string, collaboratorIds: string[]) {
    try {
      await api.tasks.associateCollaborator(taskId, collaboratorIds)
      const task = tasks.value.find((t) => t._id === taskId)
      if (task) {
        task.collaborators = Array.from(new Set([...task.collaborators, ...collaboratorIds]))
      }
    } catch (err) {
      console.error(`Failed to add collaborators:`, err)
      throw err
    }
  }

  async function removeCollaborator(taskId: string, collaboratorId: string) {
    try {
      const response = await api.tasks.deleteCollaborator(taskId, collaboratorId)
      return response.data
    } catch (error) {
      throw error
    }
  }

  function setFilters(newFilters: { project?: string | null; collaborator?: string | null }) {
    if (newFilters.project !== undefined) {
      filters.value.project = newFilters.project
    }
    if (newFilters.collaborator !== undefined) {
      filters.value.collaborator = newFilters.collaborator
    }
  }

  return {
    tasks,
    currentTask,
    isLoading,
    error,
    filters,
    filteredTasks,
    getTasksByStatus,
    getTaskById,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    addCollaborator,
    removeCollaborator,
    setFilters,
  }
})
