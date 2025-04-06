import React, { useState } from 'react';
import '../App.css'; // Use App.css for styling

const Leaderboard = () => {
  // Constant array of users with the same structure as the `user` object in Profile.js
  const usersData = [
    {
      created_at: '2025-04-01T10:00:00.000Z',
      username: 'April Wang',
      location: 'Evanston, IL, USA',
      bio: '...',
      points: 150,
      profile_picture: 'https://www.pixcrafter.com/wp-content/uploads/2024/03/cartoon-style-indoor-plant-vector-illustration.jpg',
      num_plants: 12,
    },
    {
      created_at: '2025-03-15T14:30:00.000Z',
      username: 'John Doe',
      location: 'Chicago, IL, USA',
      bio: 'Gardening enthusiast 🌻',
      points: 75,
      profile_picture: 'https://via.placeholder.com/150',
      num_plants: 8,
    },
    {
      created_at: '2025-02-20T09:15:00.000Z',
      username: 'Jane Smith',
      location: 'New York, NY, USA',
      bio: 'Nature explorer 🌳',
      points: 300,
      profile_picture: 'https://via.placeholder.com/150',
      num_plants: 20,
    },
    {
      created_at: '2025-01-10T16:45:00.000Z',
      username: 'Alice Johnson',
      location: 'San Francisco, CA, USA',
      bio: 'Loves succulents 🌵',
      points: 500,
      profile_picture: 'https://via.placeholder.com/150',
      num_plants: 25,
    },
    {
      created_at: '2025-04-05T19:01:47.799Z',
      username: 'Bob Brown',
      location: 'Evanston, IL, USA',
      bio: 'Beginner gardener 🌼',
      points: 10,
      profile_picture: 'https://via.placeholder.com/150',
      num_plants: 2,
    },
  ];

  const [searchLocation, setSearchLocation] = useState(''); // Location filter
  const [filteredUsers, setFilteredUsers] = useState(
    usersData.sort((a, b) => b.points - a.points) // Sort users by points in descending order
  );

  // Handle location search
  const handleSearch = (e) => {
    const location = e.target.value.toLowerCase();
    setSearchLocation(location);
    const filtered = usersData
      .filter((user) => user.location.toLowerCase().includes(location))
      .sort((a, b) => b.points - a.points); // Ensure sorted order after filtering
    setFilteredUsers(filtered);
  };

  // Handle sending a connect request
  const handleConnectRequest = (username) => {
    alert(`Connect request sent to ${username}!`);
  };

  return (
    <div className="connections-container">
      <h1>Leaderboard</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by location..."
          value={searchLocation}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Profile</th>
            <th>Username</th>
            <th>Location</th>
            <th>Bio</th>
            <th>Points</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <img
                  src={user.profile_picture}
                  alt={`${user.username}'s profile`}
                  className="leaderboard-profile-picture"
                />
              </td>
              <td>{user.username}</td>
              <td>{user.location}</td>
              <td>{user.bio}</td>
              <td>{user.points}</td>
              <td>
                <button
                  className="connect-button"
                  onClick={() => handleConnectRequest(user.username)}
                >
                  Connect
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;