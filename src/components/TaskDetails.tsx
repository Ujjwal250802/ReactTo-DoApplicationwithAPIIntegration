import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Bell, RotateCcw, Calendar, Star, Trash2, X, ChevronUp, ChevronDown } from 'lucide-react';
import { RootState } from '../store';
import { deleteTask, updateTaskDueDate, updateTaskReminder, updateTaskNotes } from '../store/slices/taskSlice';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toggleImportant } from '../store/slices/taskSlice';

interface TaskDetailsProps {
  taskId: string;
  onClose: () => void;
}

const TaskDetails = ({ taskId, onClose }: TaskDetailsProps) => {
  const dispatch = useDispatch();
  const task = useSelector((state: RootState) =>
    state.tasks.tasks.find((t) => t.id === taskId)
  );
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const [dueDate, setDueDate] = useState<Date | null>(
    task?.dueDate ? new Date(task.dueDate) : null
  );
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [hours, setHours] = useState(task?.reminder ? new Date(task.reminder).getHours().toString().padStart(2, '0') : '00');
  const [minutes, setMinutes] = useState(task?.reminder ? new Date(task.reminder).getMinutes().toString().padStart(2, '0') : '00');
  const [notes, setNotes] = useState(task?.notes || '');
  const [amPm, setAmPm] = useState("AM");

  const handleDateChange = (date: Date | null) => {
    setDueDate(date);
    dispatch(
      updateTaskDueDate({
        taskId,
        dueDate: date ? date.toISOString() : null,
      })
    );
  };

  const handleTimeChange = (newHours: string, newMinutes: string) => {
    const reminderDate = new Date();
    reminderDate.setHours(parseInt(newHours), parseInt(newMinutes), 0, 0);
    
    dispatch(
      updateTaskReminder({
        taskId,
        reminder: reminderDate.toISOString(),
      })
    );

    // Schedule notification
    const now = new Date();
    const timeUntilReminder = reminderDate.getTime() - now.getTime();
    
    if (timeUntilReminder > 0) {
      setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification("Task Reminder", {
            body: `Time to do task: ${task?.title}`,
            icon: "/favicon.ico"
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              new Notification("Task Reminder", {
                body: `Time to do task: ${task?.title}`,
                icon: "/favicon.ico"
              });
            }
          });
        }
      }, timeUntilReminder);
    }
  };
  const toggleAmPm = () => {
    setAmPm((prev) => (prev === "AM" ? "PM" : "AM"));
  };

  const incrementHours = () => {
    const newHours = (parseInt(hours) + 1) % 24;
    const formattedHours = newHours.toString().padStart(2, '0');
    setHours(formattedHours);
    handleTimeChange(formattedHours, minutes);
  };

  const decrementHours = () => {
    const newHours = (parseInt(hours) - 1 + 24) % 24;
    const formattedHours = newHours.toString().padStart(2, '0');
    setHours(formattedHours);
    handleTimeChange(formattedHours, minutes);
  };

  const incrementMinutes = () => {
    const newMinutes = (parseInt(minutes) + 1) % 60;
    const formattedMinutes = newMinutes.toString().padStart(2, '0');
    setMinutes(formattedMinutes);
    handleTimeChange(hours, formattedMinutes);
  };

  const decrementMinutes = () => {
    const newMinutes = (parseInt(minutes) - 1 + 60) % 60;
    const formattedMinutes = newMinutes.toString().padStart(2, '0');
    setMinutes(formattedMinutes);
    handleTimeChange(hours, formattedMinutes);
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) < 24)) {
      const formattedHours = value.padStart(2, '0');
      setHours(formattedHours);
      handleTimeChange(formattedHours, minutes);
    }
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) < 60)) {
      const formattedMinutes = value.padStart(2, '0');
      setMinutes(formattedMinutes);
      handleTimeChange(hours, formattedMinutes);
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    dispatch(updateTaskNotes({ taskId, notes: newNotes }));
  };

  const handleDeleteTask = () => {
    dispatch(deleteTask(taskId));
    onClose();
  };

  const handleImportantToggle = () => {
    dispatch(toggleImportant(taskId)); // Updated to match the Redux action
  };

  if (!task) return null;

  return (
    <div
      className={`fixed right-0 top-0 h-screen w-80 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      } shadow-lg p-4 transform transition-transform duration-200 transition-colors flex flex-col`}
    >
      <div className="flex justify-between items-start mb-4">
  <h3
    className={`text-lg font-semibold ${
      darkMode ? 'text-white' : 'text-gray-800'
    }`}
  >
    {task?.title || 'Untitled Task'}
  </h3>
  <button
    onClick={handleImportantToggle}
    className={`p-2 rounded-lg ${
      task?.important
        ? 'text-yellow-500'
        : darkMode
        ? 'text-gray-400'
        : 'text-gray-600'
    }`}
  >
    <Star size={20} />
  </button>
</div>
      <div className="border-b border-gray-300 pb-4">
        <button className={`w-full flex items-center space-x-2 p-3 ${
          darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
        } rounded-lg transition-colors`}>
          <span>+ Add Step</span>
        </button>
        </div>
        <div className="border-b border-gray-300 pb-4">
  <div className="relative">
    <button
      onClick={() => setShowReminderPicker(!showReminderPicker)}
      className={`w-full flex items-center space-x-2 p-3 ${
        darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-200 text-gray-600"
      } rounded-lg transition-colors`}
    >
      <Bell size={20} />
      <span>Set Reminder</span>
      {hours && minutes && amPm && (
        <span className="ml-auto">{`${hours}:${minutes} ${amPm}`}</span>
      )}
    </button>
    {showReminderPicker && (
      <div
        className={`absolute z-50 mt-2 p-4 rounded-lg shadow-lg ${
          darkMode ? "bg-gray-700" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between space-x-4">
          {/* Hours */}
          <div className="flex items-center">
            <div className="flex flex-col">
              <button
                onClick={incrementHours}
                className={`p-1 rounded-t ${
                  darkMode ? "hover:bg-gray-600 text-gray-300" : "hover:bg-gray-200 text-gray-600"
                }`}
              >
                <ChevronUp size={16} />
              </button>
              <input
                type="text"
                value={hours}
                onChange={handleHoursChange}
                className={`w-12 text-center p-1 rounded ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                } border ${darkMode ? "border-gray-600" : "border-gray-300"}`}
                maxLength={2}
              />
              <button
                onClick={decrementHours}
                className={`p-1 rounded-b ${
                  darkMode ? "hover:bg-gray-600 text-gray-300" : "hover:bg-gray-200 text-gray-600"
                }`}
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
          <span className={`text-xl ${darkMode ? "text-white" : "text-gray-800"}`}>:</span>
          {/* Minutes */}
          <div className="flex items-center">
            <div className="flex flex-col">
              <button
                onClick={incrementMinutes}
                className={`p-1 rounded-t ${
                  darkMode ? "hover:bg-gray-600 text-gray-300" : "hover:bg-gray-200 text-gray-600"
                }`}
              >
                <ChevronUp size={16} />
              </button>
              <input
                type="text"
                value={minutes}
                onChange={handleMinutesChange}
                className={`w-12 text-center p-1 rounded ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                } border ${darkMode ? "border-gray-600" : "border-gray-300"}`}
                maxLength={2}
              />
              <button
                onClick={decrementMinutes}
                className={`p-1 rounded-b ${
                  darkMode ? "hover:bg-gray-600 text-gray-300" : "hover:bg-gray-200 text-gray-600"
                }`}
              >
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
          {/* AM/PM Toggle */}
          <div className="flex items-center">
            <button
              onClick={toggleAmPm}
              className={`px-4 py-2 rounded ${
                darkMode
                  ? "bg-gray-800 text-white hover:bg-gray-600"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {amPm}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
</div>

        <div className="border-b border-gray-300 pb-4">
        <div className="w-full">
          <button className={`w-full flex items-center space-x-2 p-3 ${
            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
          } rounded-lg transition-colors`}>
            <Calendar size={20} />
            <span>Add Due Date</span>
          </button>
          <DatePicker
            selected={dueDate}
            onChange={handleDateChange}
            className={`mt-2 w-full p-2 rounded-lg ${
              darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
            } border ${darkMode ? 'border-gray-600' : 'border-gray-300'} transition-colors`}
            dateFormat="MMM d, yyyy"
            placeholderText="Select due date"
          />
        </div>
        </div>
        <button className={`w-full flex items-center space-x-2 p-3 ${
          darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
        } rounded-lg transition-colors`}>
          <RotateCcw size={20} />
          <span>Repeat</span>
        </button>
        <div className="mt-4">
          <textarea
            placeholder="Add Notes"
            value={notes}
            onChange={handleNotesChange}
            className={`w-full p-3 rounded-lg ${
              darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
            } border ${darkMode ? 'border-gray-600' : 'border-gray-300'} transition-colors`}
            rows={4}
          />
        </div>
        <div className="mt-4 flex justify-left items-end">
        <button
          onClick={onClose}
          className={`p-2 rounded-lg ${
            darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
          }`}
          style={{ transform: 'translateY(34px)' }} // Adjust the value as needed
        >
          <X size={20} />
        </button>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleDeleteTask}
          className={`p-2 rounded-lg text-red-500 hover:bg-red-100 transition-colors -mt-4`}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskDetails;