import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ListTodo, Star, Calendar, Users, LogOut, Menu, Plus } from 'lucide-react';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { setActiveTab } from '../store/slices/taskSlice';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const activeTab = useSelector((state: RootState) => state.tasks.activeTab);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayTasks = tasks.filter(task => {
    if (task.dueDate) {
      const taskDate = new Date(task.dueDate);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    }
    return false;
  }).length;

  const importantTasks = tasks.filter(task => task.important).length;
  const completedTasks = tasks.filter(task => task.completed).length;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center space-x-3 p-4">
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-full transition-colors duration-200 ${
            darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          <Menu size={20} />
        </button>
        <span className={`font-bold text-lg transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          DoIt
        </span>
      </div>

      {isSidebarVisible && (
        <div
          className={`w-64 h-screen transition-colors duration-200 ${
            darkMode ? 'bg-gray-900' : 'bg-gray-100'
          } p-6`}
        >
          {/* Section 1: Profile */}
          <div className={`flex flex-col items-center mb-8 pb-6 border-b transition-colors duration-200 ${
            darkMode ? 'border-gray-700' : 'border-gray-300'
          }`}>
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'}
              alt="Profile"
              className="w-24 h-24 rounded-full"
            />
            <span className={`mt-4 font-medium text-lg transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Hey, {user?.name || 'Guest'}
            </span>
          </div>

          {/* Section 2: Main Navigation */}
          <div className={`space-y-2 mb-6 pb-6 border-b transition-colors duration-200 ${
            darkMode ? 'border-gray-700' : 'border-gray-300'
          }`}>
            <button 
              onClick={() => dispatch(setActiveTab('all'))}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'all' 
                  ? darkMode ? 'bg-gray-800' : 'bg-gray-300'
                  : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-300'
              }`}
            >
              <ListTodo size={20} className={`transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-800'}`} />
              <span className={`transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-800'}`}>All Tasks</span>
              <span className={`ml-auto px-2 rounded-full transition-colors duration-200 ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-400 text-white'
              }`}>
                {tasks.length}
              </span>
            </button>
            <button 
              onClick={() => dispatch(setActiveTab('today'))}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'today'
                  ? darkMode ? 'bg-gray-800' : 'bg-gray-300'
                  : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-300'
              }`}
            >
              <Calendar size={20} className="text-green-500" />
              <span className={`transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Today</span>
              <span className={`ml-auto px-2 rounded-full transition-colors duration-200 ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-400 text-white'
              }`}>
                {todayTasks}
              </span>
            </button>
            <button 
              onClick={() => dispatch(setActiveTab('important'))}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeTab === 'important'
                  ? darkMode ? 'bg-gray-800' : 'bg-gray-300'
                  : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-300'
              }`}
            >
              <Star size={20} className="text-yellow-500" />
              <span className={`transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Important</span>
              <span className={`ml-auto px-2 rounded-full transition-colors duration-200 ${
                darkMode ? 'bg-gray-700 text-white' : 'bg-gray-400 text-white'
              }`}>
                {importantTasks}
              </span>
            </button>
            <button className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-300'
            }`}>
              <Calendar size={20} className={`transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-800'}`} />
              <span className={`transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Planned</span>
            </button>
            <button className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-300'
            }`}>
              <Users size={20} className={`transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-800'}`} />
              <span className={`transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Assigned to me</span>
            </button>
          </div>

          {/* Section 3: Add List */}
          <div className={`mb-6 pb-6 border-b transition-colors duration-200 ${
            darkMode ? 'border-gray-700' : 'border-gray-300'
          }`}>
            <button className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-300'
            }`}>
              <Plus size={20} />
              <span>Add list</span>
            </button>
          </div>

          {/* Section 4: Statistics */}
          <div className="mb-6">
            <div className="mb-4">
              <h3 className={`font-medium transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Total Tasks
              </h3>
              <p className={`text-2xl font-bold transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {tasks.length}
              </p>
            </div>

            <div className="relative pt-4">
              <div className="w-full h-32">
                <svg viewBox="0 0 36 36" className="w-full h-full">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={darkMode ? '#374151' : '#E5E7EB'}
                    strokeWidth="3"
                    className="transition-colors duration-200"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="3"
                    strokeDasharray={`${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}, 100`}
                    className="transform -rotate-90 origin-center transition-all duration-200"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <span className={`text-xl font-bold transition-colors duration-200 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className={`transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Complete
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                  <span className={`transition-colors duration-200 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Incomplete
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Logout */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-300'
            }`}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;