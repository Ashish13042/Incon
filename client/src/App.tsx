import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Navbar from './pages/Navbar';

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
     <Navbar/>

      <Routes>
        <Route path="/" element={<Feed />} />
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