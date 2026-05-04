import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate(); // Tool to redirect the user after signup

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'entrepreneur' as 'entrepreneur' | 'investor' // TypeScript strict typing
  });

  const [message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Sending the request to your running backend
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      setMessage(response.data.message); // "User registered successfully!"
      
      // Clear the form or redirect the user to login
      setTimeout(() => {
          // navigate('/login'); // We will uncomment this once we build the login page
      }, 2000);

    } catch (err: any) {
      // Catch errors (like email already exists)
      setMessage(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Join Investor Connect</h2>
      
      {/* Display success or error messages */}
      {message && <p style={{ color: message.includes('success') ? 'green' : 'red' }}>{message}</p>}

      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="Full Name" 
          required
          onChange={(e) => setFormData({...formData, username: e.target.value})} 
          style={{ padding: '10px' }}
        />
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
        
        <label style={{ fontWeight: 'bold' }}>I am an:</label>
        <select 
          value={formData.role} 
          onChange={(e) => setFormData({...formData, role: e.target.value as 'entrepreneur' | 'investor'})}
          style={{ padding: '10px' }}
        >
          <option value="entrepreneur">Entrepreneur</option>
          <option value="investor">Investor</option>
        </select>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Create Account
        </button>
      </form>
    </div>
  );
};

export default Register;