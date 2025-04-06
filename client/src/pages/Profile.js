import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    created_at: '2025-04-05 19:01:47.79967+00',
    username: 'April Wang',
    location: 'Evanston, IL, USA',
    bio: '!!!',
    points: 120,
    profile_picture: 'https://www.pixcrafter.com/wp-content/uploads/2024/03/cartoon-style-indoor-plant-vector-illustration.jpg',
    num_plants: 12,
    last_points_update: '2025-03-29T19:01:47.799Z', // Last time points were updated
  });

  const [formData, setFormData] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    profile_picture: user.profile_picture,
  });

  const [editMode, setEditMode] = useState(false);

  const { token, userId } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to determine the level, name, and emoji based on points
  const getLevelInfo = (points) => {
    if (points >= 750) return { level: 25, name: 'Canopy 🌳' };
    if (points >= 500) return { level: 20, name: 'Bloom 🌸' };
    if (points >= 300) return { level: 15, name: 'Bud 🌼' };
    if (points >= 150) return { level: 10, name: 'Leaf 🍃' };
    if (points >= 50) return { level: 5, name: 'Seedling 🌿' };
    if (points >= 10) return { level: 1, name: 'Sprout 🌱' };
    return { level: 0, name: 'Seed 🌰' };
  };

  const { level, name } = getLevelInfo(user.points);

  // Function to add weekly points based on the number of plants
  const calculateAdditionalPoints = () => {
    let additionalPoints = 0;
    if (user.num_plants >= 21) {
      additionalPoints = 20;
    } else if (user.num_plants >= 11) {
      additionalPoints = 15;
    } else if (user.num_plants >= 6) {
      additionalPoints = 10;
    } else if (user.num_plants >= 2) {
      additionalPoints = 5;
    }
    return additionalPoints;
  };

  // Check if a week has passed since the last points update
  useEffect(() => {
    const lastUpdate = new Date(user.last_points_update);
    const now = new Date();
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds

    if (now - lastUpdate >= oneWeekInMs) {
      let newPoints = calculateAdditionalPoints();
      console.log('Adding weekly points:', newPoints);
      setUser((prevUser) => ({
        ...prevUser,
        points: prevUser.points + newPoints,
        last_points_update: now.toISOString(),
      }));
      setFormData((prevFormData) => ({
        ...prevFormData,
        points: prevFormData.points + newPoints,
        last_points_update: now.toISOString(),
      }));
      console.log('Updated points:', user.points);
    }
  }, []);
  // Update the points on the database whenever they change on frontend
  useEffect(() => {
    handleEdits();
  }, [user.last_points_update]);

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
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, [token, userId]);

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
          <p className="profile-location">{user.location}</p>
          <p className="profile-date">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
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