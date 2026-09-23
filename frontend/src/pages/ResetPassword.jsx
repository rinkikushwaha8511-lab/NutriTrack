import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PublicHeader />

      <div className="auth-container" style={{ flex: 1, padding: '2rem 1rem' }}>
        <div className="auth-card">
          <h2 className="text-center mb-3">Reset Password</h2>

          {error && <div className="text-danger mb-2 text-center">{error}</div>}

          {success ? (
            <div className="card p-3 text-center" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', borderLeft: '4px solid var(--primary-color)' }}>
              <p style={{ color: 'var(--text-dark)', margin: 0, fontWeight: 500 }}>
                Your password has been successfully reset!
              </p>
              <div className="mt-3">
                <button onClick={() => navigate('/login')} className="btn btn-sm">Proceed to Login</button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  minLength="6"
                  placeholder="At least 6 characters"
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  className="form-control" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  required 
                  placeholder="Re-enter password"
                />
              </div>

              <button type="submit" className="btn btn-block" disabled={loading}>
                {loading ? 'Updating...' : 'Reset Password'}
              </button>

              <div className="text-center mt-3">
                <Link to="/login">Back to Login</Link>
              </div>
            </form>
          )}
        </div>
      </div>

      <PublicFooter />
    </div>
  );
};

export default ResetPassword;
