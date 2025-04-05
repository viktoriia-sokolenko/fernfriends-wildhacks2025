import React, { useState } from 'react';
import EditPlant from '../components/EditPlant';

const Plants = () => {
    const [plants, setPlants] = useState([
      { id: 1, name: 'Fern', species: 'Fern', birthday: '2023-01-01', user_id: '1', days_between_watering: '7', last_watering: '2023-10-01' },
      { id: 2, name: 'Cactus', species: 'Cactus', birthday: '2023-02-01', user_id: '1', days_between_watering: '14', last_watering: '2023-09-25' },
      { id: 3, name: 'Bamboo', species: 'Orchid', birthday: '2023-03-01', user_id: '1', days_between_watering: '10', last_watering: '2023-09-30' },
    ]);
    const [editMode, setEditMode] = useState(false); // 'view' or 'edit'
    return (
      <div className='section'>
        <h1>My Plants</h1>
        {editMode ? (
          <>
          <EditPlant plants={plants}/>
          <button onClick={() => setEditMode(false)}>Cancel</button>
          </>
        )
        : (
        <>
        <button onClick={() => setEditMode(true)}>Edit Plants</button>
        <div>
          {plants.map((plant) => (
            <div key={plant.id}>
              <h2>{plant.name}</h2>
              <h4>{plant.type}</h4>
            </div>
          ))}
        </div>
        </>
        )
      }
      </div>
    );
  };

  export default Plants;