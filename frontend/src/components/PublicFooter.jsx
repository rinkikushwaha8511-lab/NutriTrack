import { Link } from 'react-router-dom';

const PublicFooter = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--white)',
      borderTop: '1px solid var(--border-color)',
      padding: '2.5rem 2rem 1.5rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.25rem' }}>
            NutriTrack
          </div>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', margin: 0 }}>
            Personalized Diet & Nutrition Tracking Platform.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--text-light)' }}>Home</Link>
          <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-light)' }}>Login</Link>
          <Link to="/register" style={{ textDecoration: 'none', color: 'var(--text-light)' }}>Register</Link>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '1.5rem auto 0',
        paddingTop: '1rem',
        borderTop: '1px solid #eee',
        textAlign: 'center',
        color: 'var(--text-light)',
        fontSize: '0.85rem'
      }}>
        © {new Date().getFullYear()} NutriTrack. All rights reserved.
      </div>
    </footer>
  );
};

export default PublicFooter;
