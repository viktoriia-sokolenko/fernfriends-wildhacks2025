import React, { use, useState } from 'react';
import plantIcon from '../assets/plant-icon.jpg';
import { motion } from "framer-motion";
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Plant = ({plant}) => {
    const formatDate = (date) => {
        const new_date = new Date(date);
        const formattedDate = new_date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          });
        return formattedDate;
    };
    const { token } = useAuth();
    const navigate = useNavigate();
    const [last_watering, setLastWatering] = useState(plant.last_watering || '');
    const calculateDaysUntilNextWatering = (lastWateringDate, daysBetweenWatering) => {
        const lastWatering = new Date(lastWateringDate);
        const today = new Date();
        const differenceInTime = today - lastWatering;
        return Math.floor(daysBetweenWatering - differenceInTime / (1000 * 60 * 60 * 24));
    };
    const calculateWateringPercentage = (lastWateringDate, daysBetweenWatering) => {
        const lastWatering = new Date(lastWateringDate);
        const today = new Date();
        const differenceInTime = today - lastWatering;
        const daysSinceLastWatering = Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
        return Math.floor((daysSinceLastWatering / daysBetweenWatering) * 100);
    }
    const calculatePlantAgeInDays = (birthday) => {
        const birthDate = new Date(birthday);
        const today = new Date();
        const ageInMilliseconds = today - birthDate;
        const ageInDays = Math.floor(ageInMilliseconds / (1000 * 60 * 60 * 24));
        return ageInDays;
    }
    const [wateredToday, setWateredToday] = useState(false);
    const handleWateredToday = async(watered) => {
        setWateredToday(watered);
        if (watered) {
            const today = new Date();
            setLastWatering(today);
            if (!token) {
                token = localStorage.getItem('access_token');
            }
            if (!token) {
                console.error('No token found');
                return;
            }
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/plants/${plant.id}`, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({last_watering: today}),
            });
    
            if (!response.ok) {
                throw new Error("Failed to update watering date");
            }
    
            const data = await response.json();
            navigate(`/plants`);
        }
    }
    useEffect(() => {
        const today = new Date().toDateString();
        const lastWateringDate = new Date(last_watering).toDateString();
        if (today === lastWateringDate) {
            setWateredToday(true);
        }
    }, [last_watering]);
    return (
        <div className="plant-card">
            <motion.img
                src={plantIcon}
                alt="plant"
                animate={{
                    filter: `grayscale(${calculateWateringPercentage(last_watering, plant.days_between_watering) / 120})`,
                }}
                transition={{ duration: 0.5 }}
                style={{ width: 80 }}
            />
            <h2>{plant.name}</h2>
            <div className="plant-progress">
            <div className='plant-characteristics'>
            <p><strong>🎂 Age: </strong>
            {calculatePlantAgeInDays(plant.birthday)} days </p>
            <p><strong>💧 Water in {calculateDaysUntilNextWatering(last_watering, plant.days_between_watering)} days </strong></p>
            </div>
            <div className="water-cylinder">
                <motion.div className="cylinder-background">
                <motion.div
                    className="water-level"
                    animate={{
                    height: `${100 - calculateWateringPercentage(last_watering, plant.days_between_watering)}%`,
                    backgroundColor: calculateWateringPercentage(last_watering, plant.days_between_watering) < 50 ? '#9BF3F0' : '#f44336', // Green if healthy, Red if needs water
                    }}
                    transition={{ duration: 1 }}
                />
                </motion.div>
            </div>
            </div>
            <div className='plant-characteristics'>
                <p>Species: {plant.species}</p>
                <p>Birthday: {formatDate(plant.birthday)}</p>
                <p>Needs watering every {plant.days_between_watering} days</p>
                <p>Last Watering: {formatDate(last_watering)}</p>
                <motion.div
                    className="droplet"
                    initial={{ scaleY: 1 }}
                    animate={{ scaleY: 1 - (calculateWateringPercentage(last_watering, plant.days_between_watering) / 100) }}
                    transition={{ duration: 0.5 }}
                />
            </div>
            <button 
                onClick={() => handleWateredToday(true)} 
                disabled={wateredToday}
                style={{ cursor: wateredToday ? 'not-allowed' : 'pointer'}}
            >
                {wateredToday ? 'Already Watered Today' : 'Just Watered'}
            </button>
        </div>
    )
};

export default Plant;