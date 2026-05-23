import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import SecretLogin from './pages/SecretLogin';
import Dashboard from './pages/admin/Dashboard';
import DashboardOverview from './pages/admin/DashboardOverview';
import ProfileManager from './pages/admin/ProfileManager';
import ProjectsManager from './pages/admin/ProjectsManager';
import MessagesManager from './pages/admin/MessagesManager';
import CVManager from './pages/admin/CVManager';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/admin-login" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Secret Admin Login */}
              <Route path="/admin-login" element={<SecretLogin />} />
              
              {/* Admin Routes - Protected */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardOverview />} />
                <Route path="profile" element={<ProfileManager />} />
                <Route path="projects" element={<ProjectsManager />} />
                <Route path="messages" element={<MessagesManager />} />
                <Route path="cv" element={<CVManager />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;