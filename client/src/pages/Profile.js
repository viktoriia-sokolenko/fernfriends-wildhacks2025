import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    created_at: '2025-04-05 19:01:47.79967+00',
    location: 'Evanston, IL, USA',
    username: 'April Wang',
    bio: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    profilePicture: 'https://via.placeholder.com/150', // Placeholder image URL
  });

  const [formData, setFormData] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    profilePicture: user.profilePicture,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({ ...user, ...formData });
    alert('Profile updated successfully!');
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profile</h1>
      <img 
        src={user.profilePicture} 
        alt={`${user.username}'s profile`} 
        className="profile-picture" 
      />
      <div className="profile-box">
        <p><strong>Username:</strong> {user.username}</p>
      </div>
      <div className="profile-box">
        <p><strong>Bio:</strong> {user.bio || 'No bio provided.'}</p>
      </div>
      <div className="profile-box">
        <p><strong>Location:</strong> {user.location}</p>
      </div>
      <div className="profile-box">
        <p><strong>Profile Created On:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
      </div>

      <h2>Update Profile</h2>
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
          <textarea
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
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;