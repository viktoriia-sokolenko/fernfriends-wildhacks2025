import plantIcon from '../assets/plant-icon.jpg';

const Plant = ({plant}) => {
    const calculateDaysSinceLastWatering = (lastWateringDate) => {
        const lastWatering = new Date(lastWateringDate);
        const today = new Date();
        const differenceInTime = today - lastWatering;
        return Math.floor(differenceInTime / (1000 * 60 * 60 * 24));
    };

    return (
        <div className="plant-card">
            <img
                src={plant.avatar_url || plantIcon}
                alt={`${plant.name} avatar`}
                width="100"
            />
            <h2>{plant.name}</h2>
            <p>Species: {plant.species}</p>
            <p>Birthday: {plant.birthday}</p>
            <p>Days Between Watering: {plant.days_between_watering}</p>
            <p>Days Since Last Watering: {calculateDaysSinceLastWatering(plant.last_watering)}</p>
        </div>
    )
};

export default Plant;