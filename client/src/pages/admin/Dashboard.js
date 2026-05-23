import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [stats, setStats] = useState({ projects: 0, messages: 0, unread: 0, cvs: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, messagesRes, cvsRes] = await Promise.all([
          API.get('/admin/projects'),
          API.get('/admin/messages'),
          API.get('/admin/cvs'), // Add CVs API endpoint
        ]);
        setStats({
          projects: projectsRes.data.length,
          messages: messagesRes.data.length,
          unread: messagesRes.data.filter(m => !m.read).length,
          cvs: cvsRes.data?.length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/admin-login';
  };

  const isActive = (path) => {
    if (path === '' && location.pathname === '/admin') return true;
    if (path !== '' && location.pathname === `/admin/${path}`) return true;
    return false;
  };

  const menuItems = [
    { path: '', name: 'Dashboard', icon: '📊', color: 'bg-blue-500' },
    { path: 'profile', name: 'Profile Settings', icon: '👤', color: 'bg-green-500' },
    { path: 'projects', name: 'Manage Projects', icon: '📁', color: 'bg-purple-500' },
    { path: 'messages', name: 'View Messages', icon: '💬', color: 'bg-yellow-500' },
    { path: 'cv', name: 'CV Manager', icon: '📄', color: 'bg-red-500' }, // NEW
  ];

  return (
    <div className="min-h-screen bg-gray-100 pt-16">
      {/* Mobile menu button */}
      <div className="fixed top-20 left-4 z-20 md:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-gray-900 text-white rounded-lg shadow-lg"
        >
          {sidebarOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed left-0 top-16 h-full bg-gray-900 text-white transition-all duration-300 z-10 ${
        sidebarOpen ? 'w-64' : 'w-0 md:w-20'
      } overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-xl">👨‍💻</span>
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="text-lg font-bold">Admin Panel</h2>
                <p className="text-xs text-gray-400">Welcome, {user?.username}</p>
              </div>
            )}
          </div>
        </div>
        
        <nav className="px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={`/admin/${item.path}`}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.name}</span>}
              {item.path === 'messages' && stats.unread > 0 && sidebarOpen && (
                <span className="ml-auto bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                  {stats.unread}
                </span>
              )}
              {item.path === 'cv' && stats.cvs > 0 && sidebarOpen && (
                <span className="ml-auto bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">
                  {stats.cvs}
                </span>
              )}
            </Link>
          ))}
          
          <div className="pt-4 mt-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300"
            >
              <span className="text-xl">🚪</span>
              {sidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;