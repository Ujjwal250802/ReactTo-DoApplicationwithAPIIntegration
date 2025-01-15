import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  important: boolean;
  createdAt: string;
  dueDate?: string;
  reminder?: string;
  notes?: string;
}

interface TasksState {
  tasks: Task[];
  activeTab: 'all' | 'today' | 'important';
}

const initialState: TasksState = {
  tasks: [],
  activeTab: 'all'
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    toggleImportant: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.important = !task.important;
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    updateTaskDueDate: (state, action: PayloadAction<{ taskId: string; dueDate: string | null }>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.dueDate = action.payload.dueDate || undefined;
      }
    },
    updateTaskReminder: (state, action: PayloadAction<{ taskId: string; reminder: string | null }>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.reminder = action.payload.reminder || undefined;
      }
    },
    updateTaskNotes: (state, action: PayloadAction<{ taskId: string; notes: string }>) => {
      const task = state.tasks.find(t => t.id === action.payload.taskId);
      if (task) {
        task.notes = action.payload.notes;
      }
    },
    setActiveTab: (state, action: PayloadAction<'all' | 'today' | 'important'>) => {
      state.activeTab = action.payload;
    },
  },
});

export const {
  addTask,
  toggleTask,
  toggleImportant,
  deleteTask,
  updateTaskDueDate,
  updateTaskReminder,
  updateTaskNotes,
  setActiveTab,
} = taskSlice.actions;

export default taskSlice.reducer;