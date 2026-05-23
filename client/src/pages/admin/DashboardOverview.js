import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    projects: 0,
    messages: 0,
    unread: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [projectsRes, messagesRes] = await Promise.all([
        API.get('/admin/projects'),
        API.get('/admin/messages'),
      ]);
      
      const projects = projectsRes.data;
      const messages = messagesRes.data;
      
      setStats({
        projects: projects.length,
        messages: messages.length,
        unread: messages.filter(m => !m.read).length
      });
      
      // Get recent 3 messages
      setRecentMessages(messages.slice(0, 3));
      // Get recent 3 projects
      setRecentProjects(projects.slice(0, 3));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { 
      title: 'Total Projects', 
      value: stats.projects, 
      icon: '📁', 
      color: 'from-blue-500 to-blue-600',
      link: '/admin/projects',
      description: 'Manage your portfolio projects',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Total Messages', 
      value: stats.messages, 
      icon: '💬', 
      color: 'from-green-500 to-green-600',
      link: '/admin/messages',
      description: `${stats.unread} unread messages`,
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Unread Messages', 
      value: stats.unread, 
      icon: '📧', 
      color: 'from-yellow-500 to-yellow-600',
      link: '/admin/messages',
      description: 'Need your attention',
      bgColor: 'bg-yellow-50'
    },
  ];

  const quickActions = [
    { name: 'Add New Project', icon: '➕', link: '/admin/projects', color: 'bg-blue-500' },
    { name: 'Update Profile', icon: '✏️', link: '/admin/profile', color: 'bg-green-500' },
    { name: 'View Messages', icon: '📧', link: '/admin/messages', color: 'bg-yellow-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your portfolio.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {statsCards.map((stat, idx) => (
          <Link
            key={idx}
            to={stat.link}
            className={`${stat.bgColor} rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                {stat.icon}
              </div>
              <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{stat.title}</h3>
            <p className="text-sm text-gray-500">{stat.description}</p>
          </Link>
        ))}
      </div>

      {/* Recent Projects and Messages */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Recent Projects */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">📁 Recent Projects</h2>
              <p className="text-sm text-gray-600">Your latest work</p>
            </div>
            <Link to="/admin/projects" className="text-sm text-blue-600 hover:text-blue-700">View All →</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <div key={project._id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{project.title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.techStack?.slice(0, 3).map((tech, i) => (
                          <span key={i} className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    {project.featured && (
                      <span className="text-yellow-500 text-sm">⭐</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No projects yet. Create your first project!
              </div>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">💬 Recent Messages</h2>
              <p className="text-sm text-gray-600">Latest inquiries</p>
            </div>
            <Link to="/admin/messages" className="text-sm text-blue-600 hover:text-blue-700">View All →</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentMessages.length > 0 ? (
              recentMessages.map((message) => (
                <div key={message._id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-800">{message.name}</span>
                        {!message.read && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{message.email}</p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">{message.message}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No messages yet. They will appear here.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">⚡ Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              to={action.link}
              className={`${action.color} text-white p-4 rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:scale-105`}
            >
              <span className="text-2xl mr-2">{action.icon}</span>
              {action.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">Pro Tips</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Mark your best projects as "Featured" to show them on the homepage</li>
              <li>• Add live demo links to make your projects more impressive</li>
              <li>• Keep your profile bio updated to attract recruiters</li>
              <li>• Check messages regularly to respond to potential opportunities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;