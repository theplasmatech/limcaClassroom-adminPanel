"use client"

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('Home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Add Students', path: '/add-student', icon: '👤' },
    { name: 'Set Timetable', path: '/timetable', icon: '📅' },
    { name: 'List of Students', path: '/students', icon: '📋' },
    { name: 'Blacklist', path: '/blacklist', icon: '🚫' },
    { name: 'Attendance Calendar', path: '/attendance', icon: '📆' },
  ];

  const handleNavClick = (itemName) => {
    setActiveItem(itemName);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    Cookies.remove('adminAuthenticated');
    router.push('/password');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white" 
         style={{ boxShadow: '0 2px 15px rgba(192, 192, 192, 0.5)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => handleNavClick(item.name)}
                className={`group relative px-3 py-2 text-sm font-light tracking-wide transition-all duration-300 ${
                  activeItem === item.name
                    ? 'text-black'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-xs opacity-60 group-hover:opacity-100 transition-opacity">
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </span>
                
                {/* Active indicator */}
                {activeItem === item.name && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black rounded-full"></div>
                )}
              </Link>
            ))}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 text-sm font-light text-gray-600 hover:text-black transition-colors duration-300 border border-gray-200 rounded-md hover:bg-gray-50"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-black transition-colors"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                }`}></span>
                <span className={`block h-0.5 w-6 bg-current transition-opacity duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}></span>
                <span className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                }`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="py-4 border-t border-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => handleNavClick(item.name)}
                className={`block w-full text-left px-4 py-3 text-sm font-light tracking-wide transition-all duration-200 ${
                  activeItem === item.name
                    ? 'text-black bg-gray-50'
                    : 'text-gray-600 hover:text-black hover:bg-gray-25'
                }`}
              >
                <span className="flex items-center space-x-3">
                  <span className="text-base opacity-70">{item.icon}</span>
                  <span>{item.name}</span>
                </span>
              </Link>
            ))}
            {/* Mobile Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm font-light text-gray-600 hover:text-black transition-colors duration-300 border-t border-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;