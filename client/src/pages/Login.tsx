import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // 1. Save the VIP Wristband (Token) into the browser's local memory
      localStorage.setItem('token', response.data.token);
      
      // 2. Save some basic user info so we can display their name later
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setMessage("Login successful! Redirecting...");
      
      // 3. Send them to the dashboard/feed
      setTimeout(() => {
          navigate('/dashboard'); // We will build this page next!
      }, 1500);

    } catch (err: any) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Login to Investor Connect</h2>
      
      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Email Address" 
          required
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          style={{ padding: '10px' }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          required
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          style={{ padding: '10px' }}
        />
        
        <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;