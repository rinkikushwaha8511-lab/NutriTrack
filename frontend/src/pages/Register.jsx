import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'Male',
    height: '',
    weight: '',
    dailyCalorieGoal: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setLoading(true);
      setError('');
      const res = await api.post('/auth/register', formData);
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PublicHeader />

      <div className="auth-container" style={{ flex: 1, padding: '2rem 1rem' }}>
        <div className="auth-card" style={{ maxWidth: '600px' }}>
          <h2 className="text-center mb-3">Create Your Account</h2>
          
          {error && (
            <div className="card p-3 mb-3 text-center" style={{ backgroundColor: 'rgba(244, 67, 54, 0.1)', borderLeft: '4px solid var(--danger-color)', color: 'var(--danger-color)' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="dashboard-grid mb-0" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
              </div>
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required minLength="6" placeholder="At least 6 characters" />
            </div>

            <div className="dashboard-grid mb-0" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label>Age *</label>
                <input type="number" name="age" className="form-control" value={formData.age} onChange={handleChange} required min="1" placeholder="25" />
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select name="gender" className="form-control" value={formData.gender} onChange={handleChange} required>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="dashboard-grid mb-0" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label>Height (cm) *</label>
                <input type="number" name="height" className="form-control" value={formData.height} onChange={handleChange} required min="1" placeholder="175" />
              </div>
              <div className="form-group">
                <label>Weight (kg) *</label>
                <input type="number" name="weight" className="form-control" value={formData.weight} onChange={handleChange} required min="1" placeholder="70" />
              </div>
              <div className="form-group">
                <label>Daily Calorie Goal *</label>
                <input type="number" name="dailyCalorieGoal" className="form-control" value={formData.dailyCalorieGoal} onChange={handleChange} required min="500" placeholder="2000" />
              </div>
            </div>

            <button type="submit" className="btn btn-block mt-2" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
          
          <div className="text-center mt-3" style={{ fontSize: '0.95rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 600 }}>Login here</Link>
          </div>
        </div>
      </div>

      <PublicFooter />
    </div>
  );
};

export default Register;
