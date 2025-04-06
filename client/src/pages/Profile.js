import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    created_at: '2025-04-05 19:01:47.79967+00',
    username: 'April Wang',
    location: 'Evanston, IL, USA',
    bio: '!!!',
    points: 120, // User's current points
    profilePicture: 'https://www.pixcrafter.com/wp-content/uploads/2024/03/cartoon-style-indoor-plant-vector-illustration.jpg',
    num_plants: 12, // Number of plants the user has
    last_points_update: '2025-03-29T19:01:47.799Z', // Last time points were updated
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
  const addWeeklyPoints = () => {
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
    setUser((prevUser) => ({
      ...prevUser,
      points: prevUser.points + additionalPoints,
      last_points_update: new Date().toISOString(), // Update the last points update time
    }));
  };

  // Check if a week has passed since the last points update
  useEffect(() => {
    const lastUpdate = new Date(user.last_points_update);
    const now = new Date();
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds

    if (now - lastUpdate >= oneWeekInMs) {
      addWeeklyPoints();
    }
  }, [user.last_points_update]); // Run this effect whenever last_points_update changes

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
        <p className="profile-level-name">{name}</p> {/* Level name moved here */}
        <p className="profile-bio">{user.bio}</p>
        <p className="profile-location">{user.location}</p>
        <p className="profile-date">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
        <div className="profile-stats">
          <p><strong>Level:</strong> {level}</p>
          <p><strong>Points:</strong> {user.points}</p>
          <p><strong>Plants:</strong> {user.num_plants}</p>
        </div>
        <button
          className="profile_button"
          onClick={() => setEditMode(true)} // Set editMode to true when clicked
        >
          Edit Profile
        </button>
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
      </form>
    </div>
  );
};

export default Profile;