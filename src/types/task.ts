export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export type Filter = TaskStatus | 'all'

export interface Task {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export interface TasksData {
  tasks: Task[]
}

export interface TaskData {
  task: Task | null
}
