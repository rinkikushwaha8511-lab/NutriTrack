import { Link } from 'react-router-dom';
import { FaLeaf } from 'react-icons/fa';

const PublicHeader = ({ user }) => {
  return (
    <header style={{
      backgroundColor: 'var(--white)',
      borderBottom: '1px solid var(--border-color)',
      boxShadow: 'var(--card-shadow)',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaLeaf style={{ color: 'var(--primary-color)', fontSize: '1.5rem' }} />
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>
            NutriTrack
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-dark)', fontWeight: 500 }}>
            Home
          </Link>

          {user ? (
            <Link to="/dashboard" className="btn" style={{ textDecoration: 'none' }}>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-dark)', fontWeight: 500 }}>
                Login
              </Link>
              <Link to="/register" className="btn" style={{ textDecoration: 'none' }}>
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default PublicHeader;
