import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 1. Tell TypeScript what a Profile looks like
interface Profile {
  _id: string;
  username: string;
  email: string;
  role: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // 2. Change our state to hold an Array of Profiles
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Get the current user's info so we can greet them
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchFeed = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/feed', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Save the array of users to state
        setProfiles(response.data.profile);
        setLoading(false);
      } catch (err: any) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    fetchFeed();
  }, [navigate]);

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Welcome, {currentUser.username}!</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        {currentUser.role === 'entrepreneur' 
          ? "Here are some Investors who might be interested in your startup:" 
          : "Here are some Entrepreneurs looking for funding:"}
      </p>
      
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      
      {loading ? (
        <p>Loading network...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* 3. Loop through the array and render a card for each person */}
          {profiles.length === 0 ? (
            <p>No profiles found in your network yet.</p>
          ) : (
            profiles.map((profile) => (
              <div key={profile._id} style={{ 
                padding: '20px', 
                backgroundColor: '#fff', 
                borderRadius: '8px', 
                border: '1px solid #ddd',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#007bff' }}>{profile.username}</h3>
                  <p style={{ margin: '0', color: '#555' }}>{profile.email}</p>
                </div>
                <span style={{ 
                  padding: '5px 10px', 
                  backgroundColor: profile.role === 'investor' ? '#28a745' : '#17a2b8', 
                  color: 'white', 
                  borderRadius: '20px', 
                  fontSize: '12px',
                  textTransform: 'capitalize'
                }}>
                  {profile.role}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;