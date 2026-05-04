import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  // A simple logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Force a hard refresh back to login
  };

  return (
    <Router>
      <div>
        <nav style={{ padding: '20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#333' }}>Home</Link>
          <Link to="/register" style={{ textDecoration: 'none', color: '#007bff' }}>Register</Link>
          <Link to="/login" style={{ textDecoration: 'none', color: '#28a745', fontWeight: 'bold' }}>Login</Link>
          <Link to="/dashboard" style={{ textDecoration: 'none', color: '#007bff' }}>Dashboard</Link>
          
          {/* We push the logout button to the far right */}
          <button 
            onClick={handleLogout} 
            style={{ marginLeft: 'auto', padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
          >
            Logout
          </button>
        </nav>

        <Routes>
          <Route path="/" element={<h1 style={{ padding: '20px' }}>Welcome to Investor Connect</h1>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* Replace the temporary h2 with your actual component */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;