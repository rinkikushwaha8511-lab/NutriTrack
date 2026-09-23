import { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Presentation handling for password recovery link
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <PublicHeader />

      <div className="auth-container" style={{ flex: 1, padding: '2rem 1rem' }}>
        <div className="auth-card">
          <h2 className="text-center mb-3">Forgot Password</h2>
          
          {submitted ? (
            <div className="card p-3 text-center" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', borderLeft: '4px solid var(--primary-color)' }}>
              <p style={{ color: 'var(--text-dark)', margin: 0, fontWeight: 500 }}>
                If an account with <strong>{email}</strong> exists, password reset instructions have been sent.
              </p>
              <div className="mt-3">
                <Link to="/login" className="btn btn-sm">Return to Login</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.2rem', textAlign: 'center' }}>
                Enter your registered email address below to receive password reset instructions.
              </p>

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

              <button type="submit" className="btn btn-block" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </button>

              <div className="text-center mt-3">
                Remembered your password? <Link to="/login">Login here</Link>
              </div>
            </form>
          )}
        </div>
      </div>

      <PublicFooter />
    </div>
  );
};

export default ForgotPassword;
