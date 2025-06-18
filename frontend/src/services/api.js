import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

const TaskService = {
  getTasks() {
    return apiClient.get("/tasks")
  },
  getTask(id) {
    return apiClient.get(`/tasks/${id}`)
  },
  createTask(task) {
    return apiClient.post("/tasks", task)
  },
  associateCollaborator(id, collaboratorId) {
    return apiClient.post(`/taks/${id}/collaborators/${collaboratorId}`)
  },
  updateTask(id) {
    return apiClient.put(`/tasks/${id}`)
  },
  deleteTask(id) {
    return apiClient.delete(`/tasks/${id}`)
  }
};

const ProjectService = {
  getProjects() {
    return apiClient.get("/projects")
  },
  getProject(id) {
    return apiClient.get(`/projects/${id}`)
  },
  getProjectTasks(id) {
    return apiClient.get(`/projects/${id}/tasks`)
  },
  createProject(project) {
    return apiClient.post("/projects", project)
  },
  updateProject(id) {
    return apiClient.put(`/projects/${id}`)
  },
  deleteProject(id) {
    return apiClient.delete(`/projects/${id}`)
  }
};

const UserService = {
  login(credentials) {
    return apiClient.post("/auth/login", credentials);
  },
  register(userData) {
    return apiClient.post("/auth/register", userData);
  },
  validateToken(token) {
    return apiClient.post("auth/validate", token)
  }
};

const CollaboratorService = {
  getCollaborators() {
    return apiClient.get("/collaborators")
  },
  getProject(id) {
    return apiClient.get(`/collaborators/${id}/tasks`)
  },
  createCollaborator(user) {
    return apiClient.post("/collaborators", user)
  },
};

export default {
  tasks: TaskService,
  projects: ProjectService,
  users: UserService,
  collaborators: CollaboratorService
}