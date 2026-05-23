import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [downloadingCV, setDownloadingCV] = useState(false);

  const titles = [
    'Full-Stack Developer',
    'React Specialist',
    'Node.js Expert',
    'MongoDB Developer',
    'Software Engineer',
    'UI/UX Designer',
    'Tech Enthusiast',
    'Creative Coder',
    'Problem Solver'
  ];

  // Typing animation effect
  useEffect(() => {
    const handleTyping = () => {
      const currentTitle = titles[titleIndex];
      if (isDeleting) {
        setDisplayText(currentTitle.substring(0, displayText.length - 1));
        if (displayText.length === 0) {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % titles.length);
        }
      } else {
        setDisplayText(currentTitle.substring(0, displayText.length + 1));
        if (displayText.length === currentTitle.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      }
    };

    const timer = setTimeout(handleTyping, 100);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, titleIndex]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, projectsRes] = await Promise.all([
        API.get('/public/profile'),
        API.get('/public/projects')
      ]);
      setProfile(profileRes.data);
      const featured = projectsRes.data.filter(p => p.featured);
      setProjects(featured.length > 0 ? featured.slice(0, 3) : projectsRes.data.slice(0, 3));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCV = async () => {
    setDownloadingCV(true);
    try {
      // Use fetch with blob for file download
      const response = await fetch('http://localhost:5000/api/public/download-cv');
      
      if (!response.ok) {
        throw new Error('CV not found');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Extract filename from Content-Disposition header or use default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'Anil_Singh_CV.pdf';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
          filename = match[1].replace(/['"]/g, '');
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CV:', error);
      alert('Failed to download CV. Please try again later.');
    } finally {
      setDownloadingCV(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-5 animate-shine"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-12">
            
            {/* Left Side - Text Content */}
            <div className="flex-1 text-center md:text-left w-full">
              <div className="overflow-hidden">
                <div className="animate-slide-in-left">
                  <div className="inline-block px-4 py-2 bg-blue-500/20 rounded-full mb-6">
                    <span className="text-blue-400 text-sm font-semibold">✨ Welcome to my portfolio</span>
                  </div>
                </div>
              </div>
              
              <div className="overflow-hidden">
                <div className="animate-pop-up">
                  <h2 className="text-2xl sm:text-3xl text-gray-300 mb-2">Hello, I'm</h2>
                </div>
              </div>
              
              <div className="overflow-hidden">
                <div className="animate-slide-in-right-text">
                  <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {profile?.fullName || 'Anil Singh'}
                  </h1>
                </div>
              </div>
              
              <div className="overflow-hidden mb-4">
                <div className="animate-fade-in-up">
                  <div className="h-12 sm:h-14">
                    <p className="text-xl sm:text-2xl md:text-3xl text-gray-300">
                      <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                        {displayText}
                      </span>
                      <span className="animate-blink inline-block w-0.5 h-6 bg-blue-400 ml-1"></span>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="overflow-hidden">
                <div className="animate-slide-in-bottom">
                  <p className="text-lg sm:text-xl text-gray-400 mb-2">
                    {profile?.location || 'University of Wolverhampton, UK'}
                  </p>
                </div>
              </div>
              
              <div className="overflow-hidden">
                <div className="animate-fade-in-up animation-delay-300">
                  <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                    {profile?.bio || 'Computer Science student passionate about web development with HTML, CSS, JavaScript, PHP & CodeIgniter'}
                  </p>
                </div>
              </div>
              
              {/* Hero Buttons */}
              <div className="flex gap-4 justify-center md:justify-start flex-wrap animate-slide-in-bottom animation-delay-500">
                <Link to="/projects" className="group relative inline-flex items-center gap-2 px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  View My Work
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link to="/contact" className="px-6 sm:px-8 py-3 border-2 border-purple-500 rounded-full font-semibold text-purple-400 hover:bg-purple-500 hover:text-white hover:border-transparent transition-all duration-300">
                  Contact Me
                </Link>
                <button 
                  onClick={handleDownloadCV}
                  disabled={downloadingCV}
                  className="px-6 sm:px-8 py-3 border-2 border-green-500 rounded-full font-semibold text-green-400 hover:bg-green-500 hover:text-white hover:border-transparent transition-all duration-300 flex items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloadingCV ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <span className="group-hover:animate-bounce">📄</span>
                      Download CV
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Side - Profile Photo */}
            <div className="flex-1 flex justify-center animate-slide-in-right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-50 animate-ping"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-75 animate-pulse"></div>
                
                <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden shadow-2xl">
                  <img 
                    src="/images/anil-photo.jpg" 
                    alt="Anil Singh"
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
                
                <div className="absolute -top-4 -right-2 sm:-top-6 sm:-right-4 bg-blue-500/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg z-10">
                  React ⚛️
                </div>
                <div className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-4 bg-purple-500/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg z-10">
                  Node.js 🚀
                </div>
                <div className="absolute top-1/2 -right-4 sm:-right-6 bg-pink-500/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg z-10">
                  MongoDB 🍃
                </div>
                <div className="absolute bottom-1/2 -left-4 sm:-left-6 bg-green-500/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold shadow-lg z-10">
                  Python 🐍
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-blue-400 rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {projects.length > 0 && (
        <section className="py-16 sm:py-20 px-4 bg-black/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Featured Projects
              </h2>
              <p className="text-gray-400 text-base sm:text-lg">Some of my best work</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {projects.map((project, idx) => (
                <div 
                  key={project._id} 
                  className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:scale-105 transition-all duration-500 hover:shadow-2xl border border-gray-700"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  <div className="h-48 sm:h-56 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-all duration-300"></div>
                    <span className="text-6xl sm:text-7xl group-hover:scale-110 transition-transform duration-500 relative z-10">
                      {idx === 0 && '🚀'}
                      {idx === 1 && '🛒'}
                      {idx === 2 && '📱'}
                    </span>
                    {project.featured && (
                      <span className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 mb-4 text-sm sm:text-base line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack?.slice(0, 4).map((tech, i) => (
                        <span key={i} className="bg-gray-700 px-2 py-1 rounded-lg text-xs text-gray-300 hover:bg-blue-600 transition">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-4">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
                          🌐 Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-gray-700 text-white px-3 py-2 rounded-lg text-sm hover:bg-gray-600 transition">
                          📦 GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View All Projects Button */}
            <div className="text-center mt-12">
              <Link to="/projects" className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-semibold text-white hover:scale-105 transition-all duration-300 shadow-lg">
                View All Projects
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      <section className="py-16 sm:py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Let's Work Together
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8">
            I'm currently seeking Graduate Software Developer or Junior Developer opportunities
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-white hover:scale-105 transition-all duration-300 shadow-lg">
              Get In Touch
              <span>✨</span>
            </Link>
            <button 
              onClick={handleDownloadCV}
              disabled={downloadingCV}
              className="inline-flex items-center gap-2 border-2 border-green-500 px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-green-400 hover:bg-green-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloadingCV ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <span>📄</span>
                  Download CV
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;