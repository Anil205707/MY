import React, { useState, useEffect } from 'react';
import API from '../services/api';

const About = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await API.get('/public/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          About Me
        </h1>
        
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Who I Am</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            {profile?.bio || "I'm a passionate Computer Science graduate from the University of Wolverhampton with hands-on experience in full-stack web development, database systems, and software engineering. I love building modern web applications and solving real-world problems through code."}
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Education</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-blue-400">Bachelor of Science (BSc Hons) in Computer Science</h3>
            <p className="text-gray-400">University of Wolverhampton | Graduated: 2026</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-400">+2 Computer Science</h3>
            <p className="text-gray-400">Bluebird Secondary School, Nepal | 2021 | CGPA: 3.34</p>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Work Experience</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-blue-400">Restaurant Manager</h3>
            <p className="text-gray-400">Burger & Sauces, UK | July 2023 - Present</p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Managing and supervising a team of 8+ staff members</li>
              <li>Improving operational efficiency in high-pressure environments</li>
              <li>Training new employees on service standards and workplace processes</li>
              <li>Resolving customer concerns effectively while maintaining service quality</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-400">Kitchen Assistant</h3>
            <p className="text-gray-400">Bunk Cocktail Bar, Wolverhampton | March 2023 - June 2023</p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Supported kitchen operations and food preparation</li>
              <li>Maintained quality, hygiene, and safety standards</li>
              <li>Worked effectively within a fast-paced team environment</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
          <div className="space-y-3">
            <p className="text-gray-300">
              <span className="font-semibold text-blue-400">Email:</span> {profile?.email || 'anil20570729@gmail.com'}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-blue-400">Phone:</span> {profile?.phone || '+44 7311306180'}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold text-blue-400">Location:</span> {profile?.location || 'Wolverhampton, United Kingdom'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;