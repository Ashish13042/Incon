import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Navbar from './pages/Navbar';
import Sidebar from './pages/Sidebar';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <Router>
      <div className="app-container">
        {/* The new global Navbar handles all login/logout logic */}
        <Navbar onToggleSidebar={
          () => {
            setIsSidebarOpen(!isSidebarOpen)
          }
        } />
        <div className="app-layout">
          <Sidebar isOpen={isSidebarOpen}/>
          <div className="main-content">
            <Routes>
              {/* We made the Live Feed the default Home page! */}
              <Route path="/" element={<Feed />} />

              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/feed" element={<Feed />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;