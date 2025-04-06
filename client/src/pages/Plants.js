import React, { useState } from 'react';
import EditPlant from '../components/EditPlant';
import Plant from '../components/Plant';
import { useAuth } from '../AuthContext';
import { useEffect } from 'react';


const Plants = () => {
    const [plants, setPlants] = useState([
      { id: 1, name: 'Fern', species: 'Fern', birthday: '2023-01-01', user_id: '1', days_between_watering: '7', last_watering: '2025-04-01' },
      { id: 2, name: 'Cactus', species: 'Cactus', birthday: '2023-02-01', user_id: '1', days_between_watering: '14', last_watering: '2025-04-03' },
      { id: 3, name: 'Bamboo', species: 'Orchid', birthday: '2023-03-01', user_id: '1', days_between_watering: '4', last_watering: '2025-03-29' },
    ]);
    const [editMode, setEditMode] = useState(false);
    const { userId, token } = useAuth();
    useEffect(() => {
      const fetchPlants = async () => {
        try {
          console.log('Fetching plants for user:', userId);
          console.log('Token:', token);
          if (!token){
            token = localStorage.getItem('access_token');
            console.log('Token from localStorage:', token);
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
        <div className="plants-list">
          {plants.map((plant) => (
          <Plant plant={plant} key={plant.id} />
          ))}
        </div>
        </div>
      )}
      </div>
    );
  };

  export default Plants;