import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    created_at: '2025-04-05 19:01:47.79967+00',
    location: 'Evanston, IL, USA',
    username: 'April Wang',
    bio: '!!!',
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
      </div>

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
<<<<<<< Updated upstream
            type="text"
=======
>>>>>>> Stashed changes
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
      </form>
    </div>
  );
};

export default Profile;