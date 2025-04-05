import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    created_at: '2025-04-05 19:01:47.79967+00',
    username: 'April Wang',
    location: 'Evanston, IL, USA',
    bio: '!!!',
    level: 0,
    points: 0,
    profilePicture: 'https://www.pixcrafter.com/wp-content/uploads/2024/03/cartoon-style-indoor-plant-vector-illustration.jpg', 
  });

  const [formData, setFormData] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    profilePicture: user.profilePicture,
  });

  const [editMode, setEditMode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ ...user, ...formData });
    setEditMode(false); // Exit edit mode after saving changes
    alert('Profile updated successfully!');
  };

  if (editMode) {
    // Render only the edit form when in edit mode
    return (
      <div className="profile-container">
        <h2 className="form-title">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="profilePicture">Profile Picture URL:</label>
            <input
              type="text"
              id="profilePicture"
              name="profilePicture"
              value={formData.profilePicture}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="profile_button">Save Changes</button>
          <button 
            type="button" 
            className="profile_button cancel_button" 
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </form>
      </div>
    );
  }

  // Render the profile view when not in edit mode
  return (
    <div className="profile-container">
      <div className="profile-card">
        <img 
          src={user.profilePicture} 
          alt={`${user.username}'s profile`} 
          className="profile-picture" 
        />
        <h1 className="profile-username">{user.username}</h1>
        <p className="profile-bio">{user.bio}</p>
        <p className="profile-location">{user.location}</p>
        <p className="profile-date">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
        <div className="profile-stats">
          <p><strong>Level:</strong> {user.level}</p>
          <p><strong>Points:</strong> {user.points}</p>
        </div>
        <button 
          className="profile_button" 
          onClick={() => setEditMode(true)} // Set editMode to true when clicked
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;