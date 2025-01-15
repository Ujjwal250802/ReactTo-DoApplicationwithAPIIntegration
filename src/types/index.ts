export interface Task {
  id: string;
  title: string;
  completed: boolean;
  important: boolean;
  createdAt: string;
  dueDate?: string;
  steps?: TaskStep[];
  notes?: string;
}

export interface TaskStep {
  id: string;
  title: string;
  completed: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}