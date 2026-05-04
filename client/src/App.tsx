import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div>
        {/* A simple navigation bar */}
        <nav style={{ padding: '20px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
          <Link to="/" style={{ marginRight: '15px', textDecoration: 'none', color: '#333' }}>Home</Link>
          <Link to="/register" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>Register</Link>
          <Link to="/login" style={{ textDecoration: 'none', color: '#28a745', fontWeight: 'bold' }}>Login</Link>
        </nav>

        {/* The Routes determine which component shows based on the URL */}
        <Routes>
          <Route path="/" element={<h1 style={{ padding: '20px' }}>Welcome to Investor Connect</h1>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<h2 style={{ padding: '20px' }}>Dashboard (You are logged in!)</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;