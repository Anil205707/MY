import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside or pressing escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'About', path: '/about', icon: '👤' },
    { name: 'Projects', path: '/projects', icon: '📁' },
    { name: 'Contact', path: '/contact', icon: '📧' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-gray-900/80 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:scale-105 transition-transform"
            >
              Anil Singh
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-blue-400'
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
              
              {/* ONLY SHOW ADMIN/DASHBOARD WHEN USER IS LOGGED IN */}
              {user && (
                <>
                  <Link
                    to="/admin"
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive('/admin')
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-blue-400'
                    }`}
                  >
                    <span className="mr-2">⚙️</span>
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
                  >
                    <span className="mr-2">🚪</span>
                    Logout
                  </button>
                </>
              )}
            </div>

            {/* Hamburger Button - Mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-800 transition-all duration-300 z-50"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-5">
                <span className={`absolute left-0 w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
                  isOpen ? 'rotate-45 top-2' : 'top-0'
                }`}></span>
                <span className={`absolute left-0 w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
                  isOpen ? 'opacity-0' : 'top-2'
                }`}></span>
                <span className={`absolute left-0 w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
                  isOpen ? '-rotate-45 top-2' : 'top-4'
                }`}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu - Slide from right */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
        isOpen ? 'visible' : 'invisible'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        ></div>
        
        {/* Menu Panel */}
        <div className={`absolute right-0 top-0 h-full w-80 bg-gray-900 shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Menu Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Menu
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-800 transition"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Only show user info when logged in */}
            {user && (
              <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">A</span>
                </div>
                <div>
                  <p className="text-white font-semibold">{user.username}</p>
                  <p className="text-gray-400 text-sm">Administrator</p>
                </div>
              </div>
            )}
          </div>

          {/* Menu Links */}
          <div className="p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-blue-400'
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="font-medium">{link.name}</span>
                {isActive(link.path) && (
                  <span className="ml-auto">✨</span>
                )}
              </Link>
            ))}
            
            <div className="h-px bg-gray-800 my-4"></div>
            
            {/* ONLY SHOW DASHBOARD AND LOGOUT WHEN USER IS LOGGED IN */}
            {user ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive('/admin')
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-blue-400'
                  }`}
                >
                  <span className="text-xl">⚙️</span>
                  <span className="font-medium">Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
                >
                  <span className="text-xl">🚪</span>
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              /* NO ADMIN BUTTON FOR PUBLIC USERS - Hidden completely */
              <div className="text-center text-gray-500 text-sm py-4">
                <p>✨ Welcome to my portfolio ✨</p>
              </div>
            )}
          </div>

          {/* Menu Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-800">
            <div className="text-center text-gray-500 text-sm">
              <p>© 2025 Anil Singh</p>
              <p className="text-xs mt-1">Full-Stack Developer</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;