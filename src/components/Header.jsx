// src/components/Header.jsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20 transition-colors duration-300 ease-in-out">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-orange-500">
          🍳 Culinary Compass
        </Link>
        <nav className="flex items-center space-x-4">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-gray-600 dark:text-gray-300 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in-out ${isActive ? 'text-orange-500' : ''}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `text-gray-600 dark:text-gray-300 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ease-in-out ${isActive ? 'text-orange-500' : ''}`
            }
          >
            Favorites
          </NavLink>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 ease-in-out"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <MoonIcon className="h-6 w-6" />
            ) : (
              <SunIcon className="h-6 w-6" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;