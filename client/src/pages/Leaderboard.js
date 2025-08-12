import React, { useState } from 'react';
import '../App.css';
import { useEffect } from 'react';
import { useAuth } from '../AuthContext';

const Leaderboard = () => {
  const { token } = useAuth();
  const [users , setUsers] = useState([]);
  
  const [searchLocation, setSearchLocation] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleSearch = (e) => {
    const location = e.target.value.toLowerCase();
    setSearchLocation(location);
    if (!location || location.trim() === '') {
      setFilteredUsers(users); 
      return;
    }
    const filtered = users
      .filter((user) => user.location?.toLowerCase().includes(location))
      .sort((a, b) => b.points - a.points);
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        if (!token) {
            token = localStorage.getItem('access_token');
        }
        if (!token) {
            console.error('No token found');
            return;
        }
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users data');
        }
        const data = await response.json();
        setUsers(data.sort((a, b) => b.points - a.points));
        setFilteredUsers(data.sort((a, b) => b.points - a.points));
        setSearchLocation(''); // Reset search location
      } catch (error) {
        console.error('Error fetching users data:', error);
      }
    };
    fetchUsersData();
  }, []);
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
            <th>Plants</th>
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
              <td>{user.num_plants}</td>
              <td>
                {user.private ? (
                  'Private'
                ) : (
                  <button
                    className="connect-button"
                    onClick={() => alert(`${user.username}'s contact info: ${user.contact_info}`)}
                  >
                    Connect
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;