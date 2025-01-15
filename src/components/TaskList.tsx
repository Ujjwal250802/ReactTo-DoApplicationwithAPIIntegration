import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, RotateCcw, Calendar, Star } from 'lucide-react';
import { RootState } from '../store';
import { addTask, toggleTask, toggleImportant } from '../store/slices/taskSlice';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import TaskDetails from './TaskDetails';

const TaskList = () => {
  const [newTask, setNewTask] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const activeTab = useSelector((state: RootState) => state.tasks.activeTab);
  const dispatch = useDispatch();

  const handleAddTask = () => {
    if (newTask.trim()) {
      dispatch(
        addTask({
          id: Date.now().toString(),
          title: newTask,
          completed: false,
          important: false,
          createdAt: new Date().toISOString(),
          dueDate: selectedDate ? selectedDate.toISOString() : undefined,
        })
      );
      setNewTask('');
      setSelectedDate(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === 'today') {
      if (task.dueDate) {
        const taskDate = new Date(task.dueDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      }
      return false;
    } else if (activeTab === 'important') {
      return task.important;
    }
    return true; // 'all' tab
  });

  const incompleteTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);

  const renderTask = (task: any) => (
    <div
      key={task.id}
      className={`flex items-center justify-between space-x-3 p-3 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-lg shadow-sm mb-2 transition-colors cursor-pointer`}
      onClick={() => setSelectedTaskId(task.id)}
    >
      <div className="flex items-center space-x-3 flex-1">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => {
            e.stopPropagation();
            dispatch(toggleTask(task.id));
          }}
          className={`w-5 h-5 rounded-full border-2 ${
            darkMode ? 'border-gray-600' : 'border-gray-400'
          } transition-colors`}
        />
        <span
          className={`flex-1 ${
            task.completed
              ? 'line-through text-gray-500'
              : darkMode
              ? 'text-white'
              : 'text-gray-800'
          } transition-colors`}
        >
          {task.title}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        {task.dueDate && (
          <span
            className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            } transition-colors`}
          >
            {new Date(task.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(toggleImportant(task.id));
          }}
          className={`p-1 rounded-lg ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          } ${task.important ? 'text-yellow-500' : darkMode ? 'text-gray-400' : 'text-gray-600'} transition-colors`}
        >
          <Star size={20} fill={task.important ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );

  return (
    <div className={`flex-1 p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors`}>
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add A Task"
            className={`flex-1 ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            } px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors`}
          />
          <div className="flex space-x-2">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              customInput={
                <button className={`p-2 ${
                  darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                } rounded-lg transition-colors`}>
                  <Calendar size={20} />
                </button>
              }
              dateFormat="MMM d, yyyy"
              placeholderText="Due date"
            />
          </div>
          <div className="flex space-x-2">
            <button className={`p-2 ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
            } rounded-lg transition-colors`}>
              <Bell size={20} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>
            <button className={`p-2 ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
            } rounded-lg transition-colors`}>
              <RotateCcw size={20} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>
          </div>
          <button
            onClick={handleAddTask}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            ADD TASK
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className={`text-lg font-semibold ${
          darkMode ? 'text-white' : 'text-gray-800'
        } transition-colors`}>
          {activeTab === 'today' ? "Today's Tasks" : 
           activeTab === 'important' ? "Important Tasks" : "All Tasks"}
        </h3>
        {incompleteTasks.map(renderTask)}
      </div>

      <div className={`my-6 border-t ${
        darkMode ? 'border-gray-700' : 'border-gray-300'
      } transition-colors`} />

      <div className="space-y-4">
        <h3 className={`text-lg font-semibold ${
          darkMode ? 'text-white' : 'text-gray-800'
        } transition-colors`}>
          Completed Tasks
        </h3>
        {completedTasks.map(renderTask)}
      </div>

      {selectedTaskId && (
        <TaskDetails
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
};

export default TaskList;