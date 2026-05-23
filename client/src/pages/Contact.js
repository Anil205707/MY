import React, { useState } from 'react';
import API from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await API.post('/public/contact', formData);
      setStatus({ 
        type: 'success', 
        message: '✓ Message sent successfully! I will get back to you soon.' 
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: '✗ Failed to send message. Please email me directly at anil20570729@gmail.com' 
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: '📧', title: 'Email', value: 'anil20570729@gmail.com', link: 'mailto:anil20570729@gmail.com', color: 'from-blue-500 to-blue-600' },
    { icon: '📱', title: 'Phone', value: '+44 7311306180', link: 'tel:+447311306180', color: 'from-green-500 to-green-600' },
    { icon: '📍', title: 'Location', value: 'Wolverhampton, United Kingdom', link: null, color: 'from-purple-500 to-purple-600' },
  ];

  const socialLinks = [
    { name: 'GitHub', icon: '🐙', url: 'https://github.com/anil205707', color: 'bg-gray-800 hover:bg-gray-900' },
    { name: 'LinkedIn', icon: '🔗', url: 'https://www.linkedin.com/in/anil-singh-036832276/', color: 'bg-blue-700 hover:bg-blue-800' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com/', color: 'bg-sky-500 hover:bg-sky-600' },
  ];

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-blue-500/20 rounded-full mb-4">
            <span className="text-blue-400 text-sm font-semibold">📬 Get in Touch</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
            Contact Me
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Have a question or want to work together? Feel free to reach out!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Side - Contact Information Cards */}
          <div className="space-y-6">
            {/* Main Contact Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="text-3xl">✨</span> Let's Connect
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                I'm currently seeking Graduate Software Developer or Junior Developer opportunities. 
                Whether you have a question or just want to say hi, I'll try my best to get back to you!
              </p>
              
              {/* Contact Info Cards */}
              <div className="space-y-4">
                {contactInfo.map((info, idx) => (
                  <div key={idx} className="group relative">
                    {info.link ? (
                      <a 
                        href={info.link}
                        className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                      >
                        <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center text-xl shadow-lg`}>
                          {info.icon}
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">{info.title}</p>
                          <p className="text-white font-semibold">{info.value}</p>
                        </div>
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl">
                        <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center text-xl shadow-lg`}>
                          {info.icon}
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">{info.title}</p>
                          <p className="text-white font-semibold">{info.value}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-6 border-t border-gray-700">
                <p className="text-gray-400 mb-4">Connect with me on social media:</p>
                <div className="flex gap-4">
                  {socialLinks.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${social.color} text-white p-3 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-xl`}
                    >
                      <span className="text-xl">{social.icon}</span>
                      <span className="ml-2 hidden md:inline">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Availability Card */}
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-xl">⏰</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Response Time</h3>
                  <p className="text-gray-400 text-sm">I usually respond within 24-48 hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Send me a message</h2>
              <p className="text-gray-400 text-sm">Fill out the form below and I'll get back to you</p>
            </div>

            {status.message && (
              <div className={`mb-6 p-4 rounded-xl ${
                status.type === 'success' 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="group">
                <label className="block text-gray-300 font-semibold mb-2 text-sm">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">👤</span>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-gray-300 font-semibold mb-2 text-sm">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">📧</span>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-gray-300 font-semibold mb-2 text-sm">
                  Subject
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">📝</span>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Job Opportunity / Collaboration / Question"
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-gray-300 font-semibold mb-2 text-sm">
                  Message <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-gray-500">💬</span>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, opportunity, or just say hello..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500 transition resize-none"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <span className="group-hover:translate-x-1 transition-transform">✈️</span>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Form Footer */}
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-xs">
                <span className="text-green-400">✓</span> Your information is safe with me
              </p>
            </div>
          </div>
        </div>

        {/* Map / Location Section */}
        <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                <span className="text-xl">📍</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Based in</p>
                <p className="text-white font-semibold">Wolverhampton, United Kingdom</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-xl">⏰</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Timezone</p>
                <p className="text-white font-semibold">GMT (UTC+0)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <span className="text-xl">💼</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Open for</p>
                <p className="text-white font-semibold">Full-time / Remote</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;