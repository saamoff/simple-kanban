import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api.js'
import type { Project } from '../types/project.ts'

export const useProjectStore = defineStore('project', () => {
  const projects = ref<Project[]>([])
  const currentProject = ref<Project | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const getProjectById = computed(() => (id: string) => {
    return projects.value.find((project) => project._id === id)
  })

  async function fetchProjects() {
    isLoading.value = true
    try {
      const response = await api.projects.getProjects()
      projects.value = response.data
    } catch (err) {
      error.value = err.message || 'Failed to fetch projects'
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProjectWithTasks(id: string) {
    isLoading.value = true
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.projects.getProject(id),
        api.projects.getProjectTasks(id),
      ])

      const project = projectRes.data
      project.tasks = tasksRes.data

      const index = projects.value.findIndex((p) => p._id === id)
      if (index !== -1) {
        projects.value[index] = project
      } else {
        projects.value.push(project)
      }

      return project
    } catch (err) {
      error.value = err.message || 'Failed to fetch project with tasks'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createProject(projectData: Omit<Project, '_id' | 'createdAt' | 'updatedAt'>) {
    isLoading.value = true
    try {
      const payload = {
        name: projectData.name || '',
      }
      const response = await api.projects.createProject(payload)
      projects.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to create project'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateProject(id: string, updateData: Partial<Project>) {
    isLoading.value = true
    try {
      const response = await api.projects.updateProject(id, updateData)
      const index = projects.value.findIndex((p: Project) => p._id === id)
      if (index !== -1) {
        projects.value[index] = response.data
      }
      if (currentProject.value?._id === id) {
        currentProject.value = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message || 'Failed to update project'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteProject(id: string) {
    isLoading.value = true
    try {
      await api.projects.deleteProject(id)
      projects.value = projects.value.filter((t) => t._id !== id)
      if (currentProject.value?._id === id) {
        currentProject.value = null
      }
    } catch (err) {
      error.value = err.message || 'Failed to delete project'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return {
    projects,
    currentProject,
    isLoading,
    error,
    getProjectById,
    fetchProjects,
    fetchProjectWithTasks,
    createProject,
    updateProject,
    deleteProject,
  }
})
