import React, { useState } from 'react';
import EditPlant from '../components/EditPlant';
import Plant from '../components/Plant';

const Plants = () => {
    const [plants, setPlants] = useState([
      { id: 1, name: 'Fern', species: 'Fern', birthday: '2023-01-01', user_id: '1', days_between_watering: '7', last_watering: '2025-04-01' },
      { id: 2, name: 'Cactus', species: 'Cactus', birthday: '2023-02-01', user_id: '1', days_between_watering: '14', last_watering: '2025-04-03' },
      { id: 3, name: 'Bamboo', species: 'Orchid', birthday: '2023-03-01', user_id: '1', days_between_watering: '4', last_watering: '2025-03-29' },
    ]);
    const [editMode, setEditMode] = useState(false);
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