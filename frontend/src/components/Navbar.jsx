import { Link } from 'react-router-dom';
import { FaBars, FaLeaf, FaSignOutAlt, FaSearch } from 'react-icons/fa';

const Navbar = ({ user, onLogout, onToggleSidebar }) => {
  const isAdmin = user && user.role === 'admin';

  return (
    <nav className="navbar">
      {/* Left: hamburger + brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {onToggleSidebar && (
          <button
            className="mobile-toggle-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
            style={{
              background: 'none', border: 'none',
              fontSize: '1.2rem', color: 'var(--text-dark)',
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', padding: '4px'
            }}
          >
            <FaBars />
          </button>
        )}

        <div className="navbar-brand">
          <Link
            to={isAdmin ? '/admin/dashboard' : '/dashboard'}
            style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FaLeaf style={{ color: 'var(--primary-color)' }} />
            NutriTrack
            {isAdmin && (
              <span style={{
                fontSize: '0.68rem',
                backgroundColor: '#7b1fa2',
                color: '#fff',
                padding: '2px 7px',
                borderRadius: '10px',
                fontWeight: 'bold',
                letterSpacing: '0.6px'
              }}>
                ADMIN
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Right: role-aware actions */}
      <div className="navbar-user" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {isAdmin ? (
          /* Admin: show admin navigation shortcuts */
          <>
            <Link
              to="/admin/dashboard?tab=users"
              style={{ color: '#42a5f5', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}
            >
              Users
            </Link>
            <Link
              to="/admin/dashboard?tab=foods"
              style={{ color: '#66bb6a', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}
            >
              Food DB
            </Link>
          </>
        ) : (
          /* Normal user: show food search shortcut */
          <Link
            to="/food-search"
            style={{
              color: 'var(--primary-color)',
              textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '5px',
              fontWeight: 500
            }}
          >
            <FaSearch size={14} /> Food DB
          </Link>
        )}

        <span style={{ fontWeight: 500 }}>Hello, {user.name}</span>

        <button
          onClick={onLogout}
          className="btn btn-danger btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <FaSignOutAlt size={14} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
