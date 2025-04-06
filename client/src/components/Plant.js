import React, { use, useState } from 'react';
import plantIcon from '../assets/plant-icon.jpg';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion } from "framer-motion";



const Plant = ({plant}) => {
    const [plantInfo, setPlantInfo] = useState({
        id: plant.id || 0,
        name: plant.name || '',
        species: plant.species || '',
        birthday: plant.birthday || '',
        user_id: plant.user_id || '',
        days_between_watering: plant.days_between_watering || '',
        last_watering: plant.last_watering || '',
    });
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
    const handleWateredToday = (watered) => {
        setWateredToday(watered);
        if (watered) {
            const today = new Date();
            const updatedPlant = {
                ...plantInfo,
                last_watering: today.toISOString().split('T')[0],
            };
            setPlantInfo(updatedPlant);
        }
    }
    return (
        <div className="plant-card">
            <motion.img
                src={plantIcon}
                alt="plant"
                animate={{
                    filter: `grayscale(${calculateWateringPercentage(plant.last_watering, plant.days_between_watering) / 120})`,
                }}
                transition={{ duration: 0.5 }}
                style={{ width: 80 }}
            />
            <h2>{plant.name}</h2>
            <div className="plant-progress">
            <div className='plant-characteristics'>
            <p><strong>🎂 Age: </strong>
            {calculatePlantAgeInDays(plant.birthday)} days </p>
            <p><strong>💧 Water in {calculateDaysUntilNextWatering(plant.last_watering, plant.days_between_watering)} days </strong></p>
            </div>
            <div className="water-cylinder">
                <motion.div className="cylinder-background">
                <motion.div
                    className="water-level"
                    animate={{
                    height: `${100 - calculateWateringPercentage(plant.last_watering, plant.days_between_watering)}%`,
                    backgroundColor: calculateWateringPercentage(plant.last_watering, plant.days_between_watering) < 50 ? '#9BF3F0' : '#f44336', // Green if healthy, Red if needs water
                    }}
                    transition={{ duration: 1 }}
                />
                </motion.div>
            </div>
            </div>
            <div className='plant-characteristics'>
                <p>Species: {plant.species}</p>
                <p>Birthday: {plant.birthday}</p>
                <p>Needs watering every {plant.days_between_watering} days</p>
                <p>Last Watering: {plant.last_watering}</p>
                <motion.div
                    className="droplet"
                    initial={{ scaleY: 1 }}
                    animate={{ scaleY: 1 - (calculateWateringPercentage(plant.last_watering, plant.days_between_watering) / 100) }}
                    transition={{ duration: 0.5 }}
                />
            </div>
            <button onClick={handleWateredToday}>{wateredToday ? 'Already Watered Today' : 'Just Watered'}</button>
        </div>
    )
};

export default Plant;