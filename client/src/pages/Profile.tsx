import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

interface ProfileData {
  _id: string;
  username: string;
  email: string;
  role: string;
}

const Profile: React.FC = () => {
  const { id } = useParams(); // Grabs the ID from the URL
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
      } catch (err: any) {
        setError("Profile not found.");
      }
    };

    fetchProfile();
  }, [id, navigate]);

  if (error) return <div style={{ padding: '50px', color: 'red' }}><h2>{error}</h2></div>;
  if (!profile) return <div style={{ padding: '50px' }}><h2>Loading profile...</h2></div>;

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <button 
        onClick={() => navigate('/dashboard')}
        style={{ marginBottom: '20px', padding: '8px 15px', cursor: 'pointer' }}
      >
        &larr; Back to Dashboard
      </button>

      <div style={{ padding: '30px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>{profile.username}</h1>
        
        <span style={{ 
          padding: '5px 12px', 
          backgroundColor: profile.role === 'investor' ? '#28a745' : '#17a2b8', 
          color: 'white', 
          borderRadius: '20px', 
          fontSize: '14px',
          textTransform: 'capitalize',
          display: 'inline-block',
          marginBottom: '20px'
        }}>
          {profile.role}
        </span>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <p><strong>Contact Email:</strong> {profile.email}</p>
          {/* Later, we will add Bio, Company Name, and Portfolio here! */}
        </div>
      </div>
    </div>
  );
};

export default Profile;