// stores/taskStore.ts
import { defineStore } from 'pinia'
import axios from 'axios'

interface Task {
  id: string
  title: string
  description: string
  project: string
  collaborators: string[]
  status: 'todo' | 'inprogress' | 'finished'
  // Add other task properties as needed
}

interface Collaborator {
  name: string
  // Add other collaborator properties
}

export const useTaskStore = defineStore('taskStore', {
  state: () => ({
    tasks: [] as Task[],
    selectedProjects: [] as string[],
    selectedCollaborator: null as Collaborator | null,
    collapsedProjects: [] as string[],
    selectedStatus: null as string | null,
  }),

  getters: {
    projects(state): string[] {
      return Array.from(new Set(state.tasks.map((t) => t.project)))
    },

    filteredProjects(state): string[] {
      if (!state.selectedCollaborator) return this.projects
      return this.projects.filter((project) =>
        state.tasks.some(
          (task) =>
            task.project === project &&
            task.collaborators.includes(state.selectedCollaborator!.name),
        ),
      )
    },

    tasksByProject: (state) => (project: string) => {
      return state.tasks.filter((t) => {
        const matchesProject = t.project === project
        const matchesCollaborator =
          !state.selectedCollaborator || t.collaborators.includes(state.selectedCollaborator.name)
        const matchesStatus = state.selectedStatus ? t.status === state.selectedStatus : true
        return matchesProject && matchesCollaborator && matchesStatus
      })
    },
  },

  actions: {
    async fetchTasks() {
      try {
        const response = await axios.get<Task[]>('/api/tasks')
        this.tasks = response.data
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
        throw error // Re-throw for component error handling
      }
    },

    toggleCollapse(project: string) {
      this.collapsedProjects = this.collapsedProjects.includes(project)
        ? this.collapsedProjects.filter((p) => p !== project)
        : [...this.collapsedProjects, project]
    },

    updateTaskCollaborators(taskId: string, collaborators: string[]) {
      const task = this.tasks.find((t) => t.id === taskId)
      if (task) {
        task.collaborators = collaborators
      }
    },
  },
})
