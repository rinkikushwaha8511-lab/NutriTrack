import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/auth/login', { email, password });
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PublicHeader />

      <div className="auth-container" style={{ flex: 1, padding: '2rem 1rem' }}>
        <div className="auth-card">
          <h2 className="text-center mb-3">Login to NutriTrack</h2>
          
          {error && (
            <div className="card p-3 mb-3 text-center" style={{ backgroundColor: 'rgba(244, 67, 54, 0.1)', borderLeft: '4px solid var(--danger-color)', color: 'var(--danger-color)' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="name@example.com"
              />
            </div>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Password</label>
                <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary-color)', textDecoration: 'none' }}>
                  Forgot Password?
                </Link>
              </div>
              <input 
                type="password" 
                className="form-control" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Enter password"
              />
            </div>
            <button type="submit" className="btn btn-block" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="text-center mt-3" style={{ fontSize: '0.95rem' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Register here</Link>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
};

export default Login;
