import React, { useState, useEffect } from 'react';

const CVManager = () => {
  const [cvFile, setCvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [hasCV, setHasCV] = useState(false);
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    checkBackendStatus();
    checkCVStatus();
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/');
      if (response.ok) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('error');
      }
    } catch (error) {
      setBackendStatus('error');
      console.error('Backend not reachable:', error);
    }
  };

  const checkCVStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/admin/cv-info', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHasCV(data.hasCV);
      }
    } catch (error) {
      console.error('Error checking CV:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.type)) {
        setCvFile(file);
        setMessage(null);
      } else {
        setMessage({ type: 'error', text: 'Please upload a PDF or DOCX file' });
        setCvFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!cvFile) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('cv', cvFile);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setMessage({ type: 'error', text: 'Please login again' });
        return;
      }

      console.log('Uploading to:', 'http://localhost:5000/api/admin/upload-cv');
      console.log('File:', cvFile.name, 'Size:', cvFile.size);
      
      const response = await fetch('http://localhost:5000/api/admin/upload-cv', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok && data.success) {
        setMessage({ type: 'success', text: '✅ CV uploaded successfully! Visitors can now download your CV.' });
        setCvFile(null);
        checkCVStatus();
        document.getElementById('cv-file-input').value = '';
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to upload CV' });
      }
    } catch (error) {
      console.error('Upload error details:', error);
      setMessage({ 
        type: 'error', 
        text: `Failed to upload CV. Error: ${error.message}. Make sure backend is running on port 5000.` 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          CV Manager
        </h1>
        <p className="text-gray-600 mt-2">Upload and manage your resume/CV for public download</p>
      </div>

      {/* Backend Status Indicator */}
      {backendStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h3 className="font-semibold text-red-800">Backend Not Connected</h3>
              <p className="text-red-600 text-sm">
                Make sure the backend server is running on port 5000.
                Run: <code className="bg-red-100 px-2 py-1 rounded">cd server && node server.js</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {message && (
        <div className={`mb-6 p-4 rounded-xl ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {hasCV && (
        <div className="bg-green-50 rounded-2xl p-6 mb-8 border border-green-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📄</span>
            <div className="flex-1">
              <h3 className="font-semibold text-green-800 mb-1">Current CV Available</h3>
              <p className="text-green-700 text-sm">Your CV is available for public download</p>
            </div>
            <a 
              href="http://localhost:5000/api/public/download-cv" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
            >
              Download
            </a>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Upload New CV</h2>
          <p className="text-sm text-gray-600">Upload PDF or DOCX file (Max 10MB)</p>
        </div>
        
        <div className="p-6">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <input
              id="cv-file-input"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="cv-file-input" className="cursor-pointer inline-flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 hover:bg-blue-200 transition">
                <span className="text-3xl">📄</span>
              </div>
              <p className="text-gray-600 mb-2">
                {cvFile ? cvFile.name : 'Click to select a file'}
              </p>
              <p className="text-gray-400 text-sm">PDF or DOCX (max 10MB)</p>
            </label>
          </div>
          
          {cvFile && (
            <div className="mt-4 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-semibold text-gray-800">{cvFile.name}</p>
                  <p className="text-sm text-gray-500">{(cvFile.size / 1024).toFixed(2)} KB</p>
                </div>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Uploading...
                    </span>
                  ) : (
                    'Upload CV'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <h3 className="font-semibold text-yellow-800 mb-1">Troubleshooting</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Make sure backend is running: <code className="bg-yellow-100 px-1 rounded">cd server && node server.js</code></li>
              <li>• Check MongoDB is connected</li>
              <li>• Ensure you are logged in as admin</li>
              <li>• File must be PDF or DOCX under 10MB</li>
              <li>• After upload, visitors can download from homepage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVManager;