
import React from 'react';
import { useTheme } from './ThemeProvider';
import { Sun, Moon, Monitor } from 'lucide-react';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center p-1 bg-gray-200 dark:bg-gray-700/50 rounded-lg w-full max-w-[200px]">
      <button
        type="button"
        onClick={() => setTheme('light')}
        className={`flex-1 flex items-center justify-center py-1.5 rounded-md transition-all duration-200 ${
          theme === 'light'
            ? 'bg-white text-yellow-500 shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
        title="Light Mode"
      >
        <Sun size={16} />
      </button>
      
      <button
        type="button"
        onClick={() => setTheme('dark')}
        className={`flex-1 flex items-center justify-center py-1.5 rounded-md transition-all duration-200 ${
          theme === 'dark'
            ? 'bg-gray-800 text-primary-400 shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
        title="Dark Mode"
      >
        <Moon size={16} />
      </button>

      <button
        type="button"
        onClick={() => setTheme('system')}
        className={`flex-1 flex items-center justify-center py-1.5 rounded-md transition-all duration-200 ${
          theme === 'system'
            ? 'bg-white dark:bg-gray-600 text-blue-500 dark:text-blue-300 shadow-sm'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }`}
        title="System Preference"
      >
        <Monitor size={16} />
      </button>
    </div>
  );
};
