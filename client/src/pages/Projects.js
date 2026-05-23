import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await API.get('/public/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-white text-xl">Loading projects...</div>
      </div>
    );
  }

  // Separate featured projects
  const featuredProjects = projects.filter(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);
  const allProjects = [...featuredProjects, ...otherProjects];

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          My Projects
        </h1>
        
        {allProjects.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No projects added yet. Check back soon!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProjects.map((project) => (
              <div key={project._id} className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-gray-700">
                {/* Project Image/Icon */}
                <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center relative">
                  <span className="text-6xl group-hover:scale-110 transition-transform">🚀</span>
                  {project.featured && (
                    <span className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                
                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 mb-4 line-clamp-3">{project.description}</p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack?.map((tech, i) => (
                      <span key={i} className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  {/* Links */}
                  <div className="flex gap-3 mt-4">
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition inline-flex items-center gap-1"
                      >
                        🌐 Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition inline-flex items-center gap-1"
                      >
                        📦 GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;