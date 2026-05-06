import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const currentUserString = localStorage.getItem('user');
  const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
  const isLoggedIn = !!token && !!currentUser;

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (!isLoggedIn || isAuthPage) return null;

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  return (
    <aside className={`global-sidebar ${isOpen ? '' : 'closed'}`}>
      {/* User Identity Card */}
      <div className="sidebar-identity">
        <div className={`sidebar-avatar ${currentUser.role === 'investor' ? 'investor' : ''}`}>
          {getInitials(currentUser.username)}
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-username">{currentUser.username}</div>
          <div className={`sidebar-role-badge ${currentUser.role}`}>
            {currentUser.role}
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="sidebar-section">
        <h4 className="sidebar-heading">Menu</h4>
        <nav className="sidebar-nav">
          <Link to="/" className={`sidebar-link ${location.pathname === '/' || location.pathname === '/feed' ? 'active' : ''}`}>
            <span className="sidebar-icon">🏠</span> Live Feed
          </Link>
          <Link to="/dashboard" className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
            <span className="sidebar-icon">🌐</span> Network Directory
          </Link>
          <Link to={`/profile/${currentUser._id}`} className={`sidebar-link ${location.pathname.startsWith('/profile') ? 'active' : ''}`}>
            <span className="sidebar-icon">👤</span> My Profile
          </Link>
        </nav>
      </div>

      {/* Role-Specific Actions */}
      <div className="sidebar-section">
        <h4 className="sidebar-heading">Workspace</h4>
        <nav className="sidebar-nav">
          {currentUser.role === 'entrepreneur' ? (
            <Link to="/my-pitches" className={`sidebar-link ${location.pathname === '/my-pitches' ? 'active' : ''}`}>
              <span className="sidebar-icon">🚀</span> My Pitches
            </Link>
          ) : (
            <Link to="/portfolio" className={`sidebar-link ${location.pathname === '/portfolio' ? 'active' : ''}`}>
              <span className="sidebar-icon">💼</span> Portfolio
            </Link>
          )}
        </nav>
      </div>

      <div className="sidebar-spacer" />

      {/* Utility & Account */}
      <div className="sidebar-section sidebar-bottom">
        <nav className="sidebar-nav">
          <Link to="/settings" className={`sidebar-link ${location.pathname === '/settings' ? 'active' : ''}`}>
            <span className="sidebar-icon">⚙️</span> Settings
          </Link>
          <button onClick={handleLogout} className="sidebar-link sidebar-logout-btn">
            <span className="sidebar-icon">🚪</span> Logout
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
