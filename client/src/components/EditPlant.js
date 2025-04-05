import React, { useState } from 'react';

const EditPlant = ({plants}) => {
    const [plant, setPlant] = useState({
        id: 0,
        name: '',
        species: '',
        birthday: '',
        user_id: '',
        days_between_watering: '',
        last_watering: '',
    });
    const [formData, setFormData] = useState({
        id: plant.id || 0,
        name: plant.name || '',
        species: plant.species || '',
        birthday: plant.birthday || '',
        user_id: plant.user_id || '',
        days_between_watering: plant.days_between_watering || '',
        last_watering: plant.last_watering || '',
    });
    const selectPlant = (e) => {
        if (e.target.value === 'new') {
            setPlant({
                id: 0,
                name: '',
                species: '',
                birthday: '',
                user_id: '',
                days_between_watering: '',
                last_watering: '',
            });
            setFormData({
                id: 0,
                name: '',
                species: '',
                birthday: '',
                user_id: '',
                days_between_watering: '',
                last_watering: '',
            });
        }
        else {
            const selectedPlant = plants.find(plant => plant.id === Number(e.target.value));
            setPlant(selectedPlant);
            setFormData(selectedPlant);
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Saving:', formData);
    };
    const handleReset = () => {
        setFormData(plant);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="edit-form">
                <select onChange={selectPlant} value={formData.id}>
                    <option value="">Select Plant</option>
                    {plants.map((plant) => (
                        <option key={plant.id} value={plant.id}>
                            {plant.name}
                        </option>
                    ))}
                    <option value="new">Add New</option>
                </select>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Species:
                    <input
                        type="text"
                        name="species"
                        value={formData.species}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Birthday:
                    <input
                        type="date"
                        name="birthday"
                        value={formData.birthday || ''}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Days Between Watering:
                    <input
                        type="number"
                        name="days_between_watering"
                        value={formData.days_between_watering || ''}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Last Watering:
                    <input
                        type="date"
                        name="last_watering"
                        value={formData.last_watering || ''}
                        onChange={handleChange}
                    />
                </label>
                <div className='row'>
                    <button type="submit">Save</button>
                    <button type="button" onClick={handleReset}>Reset</button>
                </div>
            </div>
        </form>
    );
};

export default EditPlant;