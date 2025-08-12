import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import BigInt from 'big-integer';

const EditPlant = ({plants}) => {
    const formatDate = (date) => {
        const new_date = new Date(date);
        const formattedDate = new_date.toLocaleDateString('en-CA');
        return formattedDate;
    };
    const { userId, token } = useAuth();
    const newPlantId = BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [plant, setPlant] = useState({
        id: newPlantId,
        name: '',
        species: '',
        birthday: '',
        user_id: userId || '',
        days_between_watering: '',
        last_watering: '',
    });
    const [formData, setFormData] = useState({
        id: plant.id || newPlantId,
        name: plant.name || '',
        species: plant.species || '',
        birthday: plant.birthday || '',
        user_id: plant.user_id || '',
        days_between_watering: plant.days_between_watering || '',
        last_watering: plant.last_watering || '',
    });
    const selectPlant = (e) => {
        setMessage('');
        if (e.target.value === 'new') {
            setPlant({
                id: newPlantId,
                name: '',
                species: '',
                birthday: '',
                user_id: userId || '',
                days_between_watering: '',
                last_watering: '',
            });
            setFormData({
                id: newPlantId,
                name: '',
                species: '',
                birthday: '',
                user_id: userId || '',
                days_between_watering: '',
                last_watering: '',
            });
            setPlantSelected(false);
        }
        else {
            const selectedPlant = plants.find(plant => plant.id === Number(e.target.value));
            const formattedBirthday = formatDate(selectedPlant.birthday);
            const formattedLastWatering = formatDate(selectedPlant.last_watering);
            setFormData({
                ...selectedPlant,
                birthday: formattedBirthday,
                last_watering: formattedLastWatering,
            });
            setPlant({
                ...selectedPlant,
                birthday: formattedBirthday,
                last_watering: formattedLastWatering,
            });
            setPlantSelected(true);
        }
    }
    const [plantSelected, setPlantSelected] = useState(false);
    const handleChange = (e) => {
        setMessage('');
        const { name, value } = e.target;
        if (name === "last_watering") {
            const today = new Date();
            const inputDate = new Date(value);
            const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const inputMidnight = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());

            if (inputMidnight > todayMidnight) {
                setMessage("Last watering date cannot be in the future.");
                return;
            }
        }
        setFormData({ ...formData, [name]: value });
    };

    const editPlantData = async(e) => {
        e.preventDefault();
        if (!token) {
            token = localStorage.getItem('access_token');
        }
        if (!token) {
            console.error('No token found');
            return;
        }
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/plants/${formData.id}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            setMessage("Failed to update plant. Please try again.");
            throw new Error("Failed to update plant");
        }

        const data = await response.json();
        setMessage("Plant updated successfully!");
        navigate(`/plants`);
    };
    const handleReset = () => {
        setFormData(plant);
        setPlantSelected(false);
    };
    const handleDelete = async(e) => {
        e.preventDefault();
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/plants/${formData.id}/${userId}`, {
            method: "DELETE",
            headers: {
            Authorization: `Bearer ${token}`
        },
        });

        if (!response.ok) {
            throw new Error("Failed to delete plant");
        }
        setMessage("Plant deleted successfully!");
        window.location = `/plants`;
    }
    return (
        <form>
            <div className="edit-form">
                <select onChange={selectPlant} value={formData.id}>
                    <option value="new">Add New</option>
                    {plants.map((plant) => (
                        <option key={plant.id} value={plant.id}>
                            {plant.name}
                        </option>
                    ))}
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
                    <button onClick={editPlantData}>Save</button>
                    <button type="button" onClick={handleReset}>Reset</button>
                    {plantSelected && (
                        <button type="button" onClick={handleDelete}>Delete plant</button>
                    )}
                </div>
                {message && <p>{message}</p>}
            </div>
        </form>
    );
};

export default EditPlant;