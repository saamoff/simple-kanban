export interface Task {
  _id: string
  title: string
  description: string
  status: 'todo' | 'inprogress' | 'done'
  project: string
  collaborators: string[]
  createdAt: string
  updatedAt: string
}

export interface Collaborator {
  _id: string
  name: string
}