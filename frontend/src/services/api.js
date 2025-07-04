import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const TaskService = {
  getTasks() {
    return apiClient.get('/tasks')
  },
  getTask(id) {
    return apiClient.get(`/tasks/${id}`)
  },
  createTask(task) {
    const taskPayload = {
      title: task.title,
      description: task.description,
      project: task.project,
      collaborators: [],
    }
    return apiClient.post('/tasks', taskPayload)
  },
  associateCollaborator(id, collaboratorIds) {
    return apiClient.post(`/tasks/${id}/collaborators`, { collaboratorIds })
  },
  deleteCollaborator(id, collaboratorId) {
    return apiClient.delete(`/tasks/${id}/collaborators/${collaboratorId}`)
  },
  updateTask(id, updateData) {
    return apiClient.put(`/tasks/${id}`, updateData)
  },
  updateTaskStatus(id, statusUpdate) {
    return apiClient.patch(`/tasks/${id}/status`, statusUpdate)
  },
  deleteTask(id) {
    return apiClient.delete(`/tasks/${id}`)
  },
}

const ProjectService = {
  getProjects() {
    return apiClient.get('/projects')
  },
  getProject(id) {
    return apiClient.get(`/projects/${id}`)
  },
  getProjectTasks(id) {
    return apiClient.get(`/projects/${id}/tasks`)
  },
  createProject(project) {
    const projectPayload = {
      name: project.name,
    }
    return apiClient.post('/projects', projectPayload)
  },
  updateProject(id, updateData) {
    return apiClient.put(`/projects/${id}`, updateData)
  },
  deleteProject(id) {
    return apiClient.delete(`/projects/${id}`)
  },
}

const UserService = {
  login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },
  register(userData) {
    return apiClient.post('/auth/register', userData)
  },
  validateToken() {
    return apiClient.get('/auth/validate')
  },
}

const CollaboratorService = {
  getCollaborators() {
    return apiClient.get('/collaborators')
  },
  getProject(id) {
    return apiClient.get(`/collaborators/${id}/tasks`)
  },
  createCollaborator(user) {
    return apiClient.post('/collaborators', user)
  },
}

const TimeTrackingService = {
  startTracking(taskId, timeZone) {
    return apiClient.post(`/time-trackers/tasks/${taskId}/start`, { timeZone })
  },
  stopTracking(taskId) {
    return apiClient.post(`/time-trackers/tasks/${taskId}/stop`)
  },
  getTimeTrackers(taskId) {
    return apiClient.get(`/time-trackers/tasks/${taskId}`)
  },
  getActiveTracking(taskId) {
    return apiClient.get(`/time-trackers/tasks/${taskId}/active`)
  },
  getSummary() {
    return apiClient.get('/time-trackers/summary')
  },
}

export default {
  tasks: TaskService,
  projects: ProjectService,
  UserService,
  collaborators: CollaboratorService,
  timeTracking: TimeTrackingService,
}
