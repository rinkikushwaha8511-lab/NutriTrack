import { NavLink, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, FaSearch, FaUtensils, FaHistory, FaTint, 
  FaWeight, FaChartLine, FaLightbulb, FaUser,
  FaShieldAlt, FaUsers, FaAppleAlt, FaTags
} from 'react-icons/fa';

// Sidebar renders ADMIN-only or USER-only navigation depending on role
const Sidebar = ({ userRole, isOpen, onCloseMobile }) => {
  const location = useLocation();

  const handleLinkClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  const isAdminTabActive = (tabName) =>
    location.pathname === '/admin/dashboard' && location.search.includes(`tab=${tabName}`);

  // ─── ADMIN SIDEBAR ───────────────────────────────────────────────────
  if (userRole === 'admin') {
    return (
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Section header */}
        <div style={{
          padding: '0.6rem 1.2rem 0.4rem',
          fontSize: '0.73rem',
          fontWeight: 800,
          color: '#ba68c8',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <FaShieldAlt /> Admin Control Center
        </div>

        {/* 1. Dashboard Overview */}
        <NavLink
          to="/admin/dashboard"
          className={() =>
            location.pathname === '/admin/dashboard' && !location.search
              ? 'sidebar-link active'
              : 'sidebar-link'
          }
          style={{ color: '#ab47bc' }}
          onClick={handleLinkClick}
        >
          <FaShieldAlt className="sidebar-icon" /> Dashboard
        </NavLink>

        {/* 2. Users */}
        <NavLink
          to="/admin/dashboard?tab=users"
          className={() => isAdminTabActive('users') ? 'sidebar-link active' : 'sidebar-link'}
          style={{ color: '#42a5f5' }}
          onClick={handleLinkClick}
        >
          <FaUsers className="sidebar-icon" /> Users
        </NavLink>

        {/* 3. Food Database */}
        <NavLink
          to="/admin/dashboard?tab=foods"
          className={() => isAdminTabActive('foods') ? 'sidebar-link active' : 'sidebar-link'}
          style={{ color: '#66bb6a' }}
          onClick={handleLinkClick}
        >
          <FaAppleAlt className="sidebar-icon" /> Food Database
        </NavLink>

        {/* 4. Categories */}
        <NavLink
          to="/admin/dashboard?tab=categories"
          className={() => isAdminTabActive('categories') ? 'sidebar-link active' : 'sidebar-link'}
          style={{ color: '#ffa726' }}
          onClick={handleLinkClick}
        >
          <FaTags className="sidebar-icon" /> Categories
        </NavLink>

      </aside>
    );
  }

  // ─── NORMAL USER SIDEBAR ─────────────────────────────────────────────
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <NavLink
        to="/dashboard"
        className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
        onClick={handleLinkClick}
      >
        <FaTachometerAlt className="sidebar-icon" /> Dashboard
      </NavLink>

      <NavLink
        to="/food-search"
        className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
        onClick={handleLinkClick}
      >
        <FaSearch className="sidebar-icon" /> Food Search
      </NavLink>

      <NavLink
        to="/meals"
        className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
        onClick={handleLinkClick}
      >
        <FaUtensils className="sidebar-icon" /> Meals
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
        onClick={handleLinkClick}
      >
        <FaHistory className="sidebar-icon" /> Meal History
      </NavLink>

      <NavLink
        to="/water"
        className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
        onClick={handleLinkClick}
      >
        <FaTint className="sidebar-icon" /> Water
      </NavLink>

      <NavLink
        to="/weight"
        className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
        onClick={handleLinkClick}
      >
        <FaWeight className="sidebar-icon" /> Weight
      </NavLink>

      <NavLink
        to="/progress"
        className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
        onClick={handleLinkClick}
      >
        <FaChartLine className="sidebar-icon" /> Progress
      </NavLink>

      <NavLink
        to="/food-suggestions"
        className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
        onClick={handleLinkClick}
      >
        <FaLightbulb className="sidebar-icon" /> Suggestions
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
        onClick={handleLinkClick}
      >
        <FaUser className="sidebar-icon" /> Profile
      </NavLink>
    </aside>
  );
};

export default Sidebar;
