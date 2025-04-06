import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    username: '',
    bio: '',
    location: '',
    profile_picture: 'https://www.pixcrafter.com/wp-content/uploads/2024/03/cartoon-style-indoor-plant-vector-illustration.jpg',
    points: 0,
    num_plants: 0,
    created_at: '',
    last_points_update: '',
    private: true,
    contact_info: ''
  });

  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    location: user?.location || '',
    profile_picture: user?.profile_picture || '',
    private: user?.private || true,
    contact_info: user?.contact_info || ''
  });

  const [editMode, setEditMode] = useState(false);

  const { token, userId, getLevelInfo } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const { level, name } = getLevelInfo(user.points);

  const handleEdits = async (e) => {
    console.log('Saving:', formData);
    try {
      if (!token) {
        token = localStorage.getItem('access_token');
      }
      if (!token) {
        console.error('No token found');
        return;
      }
      if (!userId) {
        userId = localStorage.getItem('user_id');
      }
      if (!userId) {
        console.error('No userId found');
        return;
      }
      console.log('Updating user data for userId:', userId);
      console.log('Token:', token);
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Failed to update user data');
      }
      const data = await response.json();
      console.log('User data updated successfully:', data);
      setUser(formData);
      setEditMode(false);
      navigate('/profile');
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };
  const handleDelete = async (e) => {
      try {
        if (!token) {
          token = localStorage.getItem('access_token');
        }
        if (!token) {
          console.error('No token found');
          return;
        }
        if (!userId) {
          userId = localStorage.getItem('user_id');
        }
        if (!userId) {
          console.error('No userId found');
          return;
        }
        const confirmDelete = window.confirm('Are you sure you want to delete your profile? This action cannot be undone.');
        if (!confirmDelete) return;

        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete user profile');
        }

        console.log('User profile deleted successfully');
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_id');
        navigate('/signup');
      } catch (error) {
        console.error('Error deleting user profile:', error);
      }
  };
  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) {
          token = localStorage.getItem('access_token');
        }
        if (!token) {
          console.error('No token found');
          return;
        }
        if (!userId) {
          userId = localStorage.getItem('user_id');
        }
        if (!userId) {
          console.error('No userId found');
          return;
        }
        console.log('Fetching user data for userId:', userId);
        console.log('Token:', token);
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        console.log('User data:', data);
        setUser(data);
        setFormData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [token, userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  return (
    editMode ? (
      <div className="profile-container">
        <h2 className="form-title">Edit Profile</h2>
        <form className="profile-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio:</label>
            <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="profilePicture">Profile Picture URL:</label>
            <input type="text" id="profilePicture" name="profilePicture" value={formData.profile_picture} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="private">Private:</label>
            <select id="private" name="private" value={formData.private} onChange={handleChange}>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="contactInfo">Contact Info:</label>
            <input type="text" id="contactInfo" name="contact_info" value={formData.contact_info} onChange={handleChange} />
          </div>
          <button onClick={handleEdits} className="profile_button">Save Changes</button>
          <button className="profile_button delete_button" onClick={handleDelete}>Delete Profile</button>
          <button className="profile_button cancel_button" onClick={() => setEditMode(false)}>Cancel</button>
        </form>
      </div>
    ) : (
      <div className="profile-container">
        <div className="profile-card">
          <img src={user.profile_picture} alt={`${user.username}'s profile`} className="profile-picture" />
          <h1 className="profile-username">{user.username}</h1>
          <p className="profile-level-name">{name}</p>
          <p className="profile-bio">{user.bio}</p>
          {user.contact_info && <p className="profile-bio">Contact me: {user.contact_info}</p> }
          <p className="profile-location">{user.location}</p>
          <p className="profile-date">Joined: {formatDate(user.created_at)}</p>
          <p className="profile-date">{user.private ? 'Private' : 'Public'}</p>
          <div className="profile-stats">
            <p><strong>Level:</strong> {level}</p>
            <p><strong>Points:</strong> {user.points}</p>
            <p><strong>Plants:</strong> {user.num_plants}</p>
          </div>
          <button className="profile_button" onClick={() => setEditMode(true)}>Edit Profile</button>
        </div>
      </div>
    )
  );
};

export default Profile;