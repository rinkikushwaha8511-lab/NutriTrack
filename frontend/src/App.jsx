import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Meals from './pages/Meals';
import MealHistory from './pages/MealHistory';
import WaterTrackerPage from './pages/WaterTrackerPage';
import Weight from './pages/Weight';
import Progress from './pages/Progress';
import FoodSearch from './pages/FoodSearch';
import Profile from './pages/Profile';
import FoodSuggestions from './pages/FoodSuggestions';
import AdminDashboard from './pages/AdminDashboard';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        setUserInfo(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUserInfo(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    setSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebarMobile = () => {
    setSidebarOpen(false);
  };

  // Protected Route — requires login
  const ProtectedRoute = ({ children }) => {
    if (loading) return <div className="text-center p-5 text-light">Loading...</div>;
    if (!userInfo) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Admin Route — requires login AND role === 'admin'
  const AdminRoute = ({ children }) => {
    if (loading) return <div className="text-center p-5 text-light">Loading...</div>;
    if (!userInfo) {
      return <Navigate to="/login" replace />;
    }
    if (userInfo.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  if (loading) return null;

  return (
    <Router>
      <div className="app-container">
        {userInfo && (
          <Navbar 
            user={userInfo} 
            onLogout={handleLogout} 
            onToggleSidebar={toggleSidebar} 
          />
        )}
        
        <div className="main-content">
          {userInfo && (
            <Sidebar 
              userRole={userInfo.role} 
              isOpen={sidebarOpen} 
              onCloseMobile={closeSidebarMobile} 
            />
          )}
          
          <div className="page-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home user={userInfo} />} />
              <Route path="/login" element={!userInfo ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
              <Route path="/register" element={!userInfo ? <Register onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />

              {/* Protected User Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/meals" element={<ProtectedRoute><Meals /></ProtectedRoute>} />
              <Route path="/food-search" element={<ProtectedRoute><FoodSearch /></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><MealHistory /></ProtectedRoute>} />
              <Route path="/water" element={<ProtectedRoute><WaterTrackerPage /></ProtectedRoute>} />
              <Route path="/weight" element={<ProtectedRoute><Weight /></ProtectedRoute>} />
              <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
              <Route path="/food-suggestions" element={<ProtectedRoute><FoodSuggestions /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile user={userInfo} onUpdate={handleLogin} /></ProtectedRoute>} />

              {/* Admin-Only Routes */}
              <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
