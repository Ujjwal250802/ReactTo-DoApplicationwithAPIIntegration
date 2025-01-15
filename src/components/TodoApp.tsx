import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleTheme } from '../store/slices/themeSlice';
import { Sun, Moon, Search } from 'lucide-react';
import Sidebar from './Sidebar';
import TaskList from './TaskList';
import WeatherWidget from './WeatherWidget';

const TodoApp = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className={`flex justify-end p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
          <div className="flex items-center space-x-2">
            {/* Search Icon */}
            <button
              onClick={() => console.log('Search clicked')} // Add your search functionality here
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
            >
              <Search className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            <WeatherWidget />
            <button
              onClick={() => dispatch(toggleTheme())}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
            >
              {darkMode ? (
                <Sun className="text-gray-400" />
              ) : (
                <Moon className="text-gray-600" />
              )}
            </button>
          </div>
        </header>
        <TaskList />
      </div>
    </div>
  );
};

export default TodoApp;
