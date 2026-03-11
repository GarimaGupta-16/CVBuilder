import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useContext } from 'react';

import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Builder from './pages/Builder';
import ATSAnalyzer from './pages/ATSAnalyzer';
import InterviewPrep from './pages/InterviewPrep';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-gray-950 dark:text-white">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen font-sans flex flex-col transition-colors duration-300">
            <Navbar />

          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/builder" element={
                <ProtectedRoute>
                  <Builder />
                </ProtectedRoute>
              } />
              <Route path="/builder/:id" element={
                <ProtectedRoute>
                  <Builder />
                </ProtectedRoute>
              } />
              
              <Route path="/ats" element={
                <ProtectedRoute>
                  <ATSAnalyzer />
                </ProtectedRoute>
              } />
              
              <Route path="/interview" element={
                <ProtectedRoute>
                  <InterviewPrep />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
