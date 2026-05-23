import React, { useState, useEffect } from 'react';
import API from '../../services/api';

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    liveUrl: '',
    githubUrl: '',
    featured: false
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await API.get('/admin/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    const data = {
      title: formData.title,
      description: formData.description,
      techStack: formData.techStack.split(',').map(t => t.trim()).filter(t => t),
      liveUrl: formData.liveUrl,
      githubUrl: formData.githubUrl,
      featured: formData.featured
    };

    try {
      if (editing) {
        await API.put(`/admin/projects/${editing}`, data);
        setMessage({ type: 'success', text: '✅ Project updated successfully!' });
      } else {
        await API.post('/admin/projects', data);
        setMessage({ type: 'success', text: '✅ Project added successfully!' });
      }
      
      fetchProjects();
      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving project:', error);
      setMessage({ type: 'error', text: '❌ Failed to save project. Check backend connection.' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await API.delete(`/admin/projects/${id}`);
        fetchProjects();
        setMessage({ type: 'success', text: '✅ Project deleted successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        console.error('Error deleting project:', error);
        setMessage({ type: 'error', text: '❌ Failed to delete project.' });
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  const handleEdit = (project) => {
    setEditing(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack?.join(', ') || '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured || false
    });
    // Scroll to form
    document.getElementById('project-form').scrollIntoView({ behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditing(null);
    setFormData({
      title: '',
      description: '',
      techStack: '',
      liveUrl: '',
      githubUrl: '',
      featured: false
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Manage Projects</h1>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Add/Edit Form */}
      <div id="project-form" className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">
          {editing ? '✏️ Edit Project' : '➕ Add New Project'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Personal Portfolio Website"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Describe your project - what it does, technologies used, challenges overcome..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Tech Stack <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., React, Node.js, MongoDB, Tailwind CSS"
              value={formData.techStack}
              onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Separate technologies with commas</p>
          </div>

          {/* Live Demo URL */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Live Demo URL
            </label>
            <input
              type="url"
              placeholder="https://your-project-demo.com"
              value={formData.liveUrl}
              onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Optional: Link to live demo of your project</p>
          </div>

          {/* GitHub URL */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              GitHub Repository URL
            </label>
            <input
              type="url"
              placeholder="https://github.com/username/project"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Optional: Link to your GitHub repository</p>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="font-semibold text-gray-700">⭐ Featured Project</label>
              <p className="text-xs text-gray-500">Featured projects appear first and have a special badge</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Form Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : (editing ? 'Update Project' : 'Add Project')}
            </button>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-bold">Your Projects</h2>
          <p className="text-sm text-gray-600">{projects.length} total projects</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tech Stack</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Links</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{project.title}</div>
                    <div className="text-sm text-gray-500 max-w-md truncate">{project.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {project.techStack?.map((tech, idx) => (
                        <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:text-blue-800 text-sm" title="Live Demo">
                          🌐 Live
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                           className="text-gray-600 hover:text-gray-800 text-sm" title="GitHub">
                          📦 GitHub
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {project.featured ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ⭐ Featured
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {projects.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No projects yet. Add your first project using the form above!
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsManager;