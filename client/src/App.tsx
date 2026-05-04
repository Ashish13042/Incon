import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Feed from './pages/Feed';

// Inner wrapper so we can use useLocation inside Router
function AppInner() {

  const location = useLocation();
  const hiddenNavRoutes = ['/feed'];
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Quick check to see if user is logged in for the nav bar
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div>
      {!hiddenNavRoutes.includes(location.pathname) && (
        <nav style={{ padding: '16px 24px', backgroundColor: '#13141a', borderBottom: '1px solid #222', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#fff', fontWeight: 700, fontSize: '16px', letterSpacing: '-0.3px' }}>✦ Incon</Link>
          
          {isLoggedIn && (
            <>
              <Link to="/dashboard" style={{ textDecoration: 'none', color: '#aaa', fontSize: '14px' }}>Network</Link>
            </>
          )}

          {!isLoggedIn && (
            <>
              <Link to="/register" style={{ textDecoration: 'none', color: '#aaa', fontSize: '14px' }}>Register</Link>
              <Link to="/login" style={{ textDecoration: 'none', color: '#aaa', fontSize: '14px' }}>Login</Link>
            </>
          )}
          
          {isLoggedIn && (
            <button onClick={handleLogout} style={{ marginLeft: 'auto', padding: '6px 14px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '8px', fontSize: '13px', fontWeight: 600 }}>
              Logout
            </button>
          )}
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Feed/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile/:id" element={<Profile />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}

export default App;