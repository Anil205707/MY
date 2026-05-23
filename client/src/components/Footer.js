import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} Anil Singh. All rights reserved.</p>
        <p className="text-gray-500 text-sm mt-2">Built with React, Tailwind CSS & Node.js</p>
        <div className="flex justify-center gap-6 mt-4">
          <a href="https://github.com/anil205707" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">GitHub</a>
          <a href="https://www.linkedin.com/in/anil-singh-036832276/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">LinkedIn</a>
          <a href="mailto:anil20570729@gmail.com" className="text-gray-400 hover:text-blue-400">Email</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;