import React, { useState } from 'react';
import EditPlant from '../components/EditPlant';
import Plant from '../components/Plant';
import { useAuth } from '../AuthContext';
import { useEffect } from 'react';


const Plants = () => {
    const [plants, setPlants] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const { userId, token } = useAuth();
    useEffect(() => {
      const fetchPlants = async () => {
        try {
          if (!token){
            token = localStorage.getItem('access_token');
          }
          if (!token) {
            console.error('No token found');
            return;
        }
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/plants/${userId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch plants');
          }

          const data = await response.json();
          setPlants(data || []);
        } catch (error) {
          console.error('Error fetching plants:', error);
        }
      };
      if (token) {
        fetchPlants();
      }
    }, [token, editMode, userId]);
    return (
      <div className='section'>
      <div className="headline-button">
        <h1>My Plants</h1>
        <button onClick={() => setEditMode(!editMode)}>
        {editMode ? 'Cancel' : 'Edit Plants'}
        </button>
      </div>
      {editMode ? (
        <>
        <EditPlant plants={plants} />
        </>
      ) : (
        <div className='plants-container'>
        {plants.length === 0 ? (
          <h2>No plants found or your plants are still loading ... </h2>
        ) : (
          <div className="plants-list">
            {plants.map((plant) => (
              <Plant plant={plant} key={plant.id} />
            ))}
          </div>
      )}
      </div>
      )}
    </div>
  );
}

  export default Plants;