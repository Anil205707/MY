import React, { useState, useEffect } from 'react';
import API from '../../services/api';

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => { fetchMessages(); }, []);

  const fetchMessages = async () => {
    try {
      const res = await API.get('/admin/messages');
      setMessages(res.data);
    } catch (error) { console.error(error); }
  };

  const deleteMessage = async (id) => {
    if (window.confirm('Delete?')) { await API.delete(`/admin/messages/${id}`); fetchMessages(); }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Messages</h1>
      <div className="space-y-4">
        {messages.map(m => (
          <div key={m._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between mb-2"><h3 className="font-bold">{m.name}</h3><span className="text-sm text-gray-500">{new Date(m.createdAt).toLocaleDateString()}</span></div>
            <p className="text-gray-600 text-sm">{m.email}</p>
            <p className="mt-3 text-gray-700">{m.message}</p>
            <button onClick={() => deleteMessage(m._id)} className="mt-3 text-red-600 text-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesManager;