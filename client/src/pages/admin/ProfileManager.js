import React, { useState, useEffect } from 'react';
import API from '../../services/api';

const ProfileManager = () => {
  const [profile, setProfile] = useState({
    fullName: 'Anil Singh',
    title: 'Computer Science Graduate | Full-Stack Developer',
    bio: 'Results-driven Computer Science undergraduate at University of Wolverhampton with hands-on experience in software engineering, full-stack web development, database systems, and application design. Strong technical foundation in programming, debugging, responsive development, API integration, and problem-solving.',
    email: 'anil20570729@gmail.com',
    phone: '+44 7311306180',
    location: 'Wolverhampton, United Kingdom',
    socialLinks: {
      github: 'https://github.com/anil205707',
      linkedin: 'https://linkedin.com/in/anil-singh',
      twitter: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setFetchLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await API.get('/admin/profile');
      if (response.data && Object.keys(response.data).length > 0) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile({
        ...profile,
        [parent]: { ...profile[parent], [child]: value }
      });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage({ type: 'error', text: 'Please login again' });
        return;
      }
      
      await API.put('/admin/profile', profile);
      setMessage({ type: 'success', text: '✅ Profile updated successfully! Visitors will see the changes immediately.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: '❌ Failed to update profile. Please check if backend server is running.' });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Profile Settings
        </h1>
        <p className="text-gray-600 mt-2">Manage your public profile information</p>
      </div>

      {/* Alert Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            <span>{message.type === 'success' ? '✅' : '❌'}</span>
            <span>{message.text}</span>
          </div>
        </div>
      )}

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <p className="text-blue-800 font-semibold">Quick Tip</p>
            <p className="text-blue-600 text-sm">Any changes you make here will immediately appear on your public website (Home, About, and Contact pages). No need to restart the server.</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
            <p className="text-sm text-gray-600">This information appears on your homepage</p>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Your full name"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Appears on the homepage hero section</p>
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Professional Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={profile.title || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="e.g., Software Developer"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Shown below your name on the homepage</p>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Bio / Description</label>
              <textarea
                name="bio"
                value={profile.bio || ''}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                placeholder="Tell visitors about yourself..."
              />
              <p className="text-xs text-gray-500 mt-1">Appears on the homepage and about page</p>
            </div>
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
            <p className="text-sm text-gray-600">How visitors can reach you</p>
          </div>
          <div className="p-6 space-y-5">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={profile.location || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="City, Country"
              />
            </div>
          </div>
        </div>

        {/* Social Links Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Social Media Links</h2>
            <p className="text-sm text-gray-600">Connect with visitors on social platforms</p>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <span className="mr-2">🐙</span> GitHub
              </label>
              <input
                type="url"
                name="socialLinks.github"
                value={profile.socialLinks?.github || ''}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                <span className="mr-2">🔗</span> LinkedIn
              </label>
              <input
                type="url"
                name="socialLinks.linkedin"
                value={profile.socialLinks?.linkedin || ''}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
          <h3 className="font-semibold text-gray-800 mb-3">📱 Live Preview</h3>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-600"><strong>Name:</strong> {profile.fullName || 'Not set'}</p>
            <p className="text-sm text-gray-600 mt-1"><strong>Title:</strong> {profile.title || 'Not set'}</p>
            <p className="text-sm text-gray-600 mt-1"><strong>Email:</strong> {profile.email || 'Not set'}</p>
            <p className="text-sm text-gray-600 mt-1"><strong>Location:</strong> {profile.location || 'Not set'}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                💾 Save Changes
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={fetchProfile}
            className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300"
          >
            ↻ Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileManager;