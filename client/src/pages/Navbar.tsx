import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
  onToggleSidebar: () => void;
}


const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Check if user is logged in
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!token;

  // 2. Helper to get initials
  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // 3. Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload(); // Refresh to clear state
  };

  return (
    <nav className="main-navbar">
      <div className="nav-container">
        <button className="nav-icon-btn" title="Hamburger Menu" onClick={onToggleSidebar}>
          <Menu />
        </button>
        {/* Left: Logo */}
        <Link to="/" className="nav-logo">✦ Incon</Link>

        <div className="nav-spacer" />

        {/* Right: Actions */}
        <div className="nav-actions">
          {isLoggedIn ? (
            <>
              <button className="nav-icon-btn" title="Notifications"><Bell /></button>
              <div className="nav-user-menu">
                <div className="nav-avatar">
                  {getInitials(currentUser.username)}
                </div>
                <div className="nav-dropdown">
                  <div className="dropdown-user-info">
                    <span className="dropdown-username">
                      {currentUser.username || 'User'}
                    </span>
                    <span className="dropdown-role">
                      {currentUser.role || 'Role'}
                    </span>
                  </div>
                  <hr className="dropdown-divider" />
                  <Link to={`/profile/${currentUser._id}`} className="dropdown-profile-btn">
                    👤 My Profile
                  </Link>
                  <button onClick={handleLogout} className="dropdown-logout-btn">
                    🚪 Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="nav-auth-btns">
              <Link to="/login" className="nav-btn-link">Login</Link>
              <Link to="/register" className="nav-btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
