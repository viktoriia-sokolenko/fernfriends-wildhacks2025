import React, { useState } from 'react';
import './App.css';

function App() {
  const [visibleSections, setVisibleSections] = useState({
    breatheEasier: false,
    stressLess: false,
    boostProductivity: false,
    healthierEnvironment: false,
    moodEnhancement: false,
    connectWithOthers: false,
    gardeningSkills: false,
    connectOwners: false,
    plantRecommendations: false,
    pointsAndLevels: false,
  });

  const toggleSection = (section) => {
    setVisibleSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Welcome to FernFriends! 🌱</h1>
        <p className="app-intro">
          Whether you're a seasoned plant parent or just starting out, this is your space to learn, grow, and enjoy the many perks of keeping greenery around.
        </p>
      </header>

      <div className="plant-characteristics">
        {/* Improve Your Gardening Skills */}
        <div className="characteristic">
          <button
            className="toggle-button"
            onClick={() => toggleSection('gardeningSkills')}
          >
            🌱 Improve Your Gardening Skills {visibleSections.gardeningSkills ? '▲' : '▼'}
          </button>
          {visibleSections.gardeningSkills && (
            <p>
              Track your plants and their watering schedules to keep them healthy and thriving. 
              Stay organized and never miss a watering day!
            </p>
          )}
        </div>

        {/* Connect With Other Plant Owners */}
        <div className="characteristic">
          <button
            className="toggle-button"
            onClick={() => toggleSection('connectOwners')}
          >
            🤝 Connect With Other Plant Owners {visibleSections.connectOwners ? '▲' : '▼'}
          </button>
          {visibleSections.connectOwners && (
            <p>
              Our platform allows you to connect with fellow plant enthusiasts! You can find them on the leaderboard, search by location, and connect to share tips, tricks, and plant care advice.
            </p>
          )}
        </div>

        {/* Get Recommendations For New Plants */}
        <div className="characteristic">
          <button
            className="toggle-button"
            onClick={() => toggleSection('plantRecommendations')}
          >
            🌿 Get Recommendations For New Plants {visibleSections.plantRecommendations ? '▲' : '▼'}
          </button>
          {visibleSections.plantRecommendations && (
            <p>
              Tell us about your environment and lifestyle, including watering habits, plant growing experience, temperature, light, and humidity in your space, and anything else you think is important.
              Based on your answers, you’ll get personalized recommendations of 3 houseplants, complete with care requirements and explanations of why each one suits your unique situation.
            </p>
          )}
        </div>

        {/* Earn Points and Track Your Progress */}
        <div className="characteristic">
          <button
            className="toggle-button"
            onClick={() => toggleSection('pointsAndLevels')}
          >
            ⭐ Earn Points and Track Your Progress {visibleSections.pointsAndLevels ? '▲' : '▼'}
          </button>
          {visibleSections.pointsAndLevels && (
            <p>
              Your points reflect how well you take care of your plants. For each plant, we count how many full watering periods have passed between its birthday and its last watering date. 
              Each watering period is the number of days the plant needs between waterings. 
              For every watering period completed, you earn 5 points. As you earn points, you’ll progress through levels starting at Seed 🌰 (0–9 points), then Sprout 🌱 (10+ points), Seedling 🌿 (50+ points), Leaf 🍃 (100+ points), Bud 🌼 (150+ points), Bloom 🌸 (200+ points), and finally reaching the Canopy 🌳 at 300 points and beyond.
            </p>
          )}
        </div>
      </div>

      <p className="additional-info">
        Indoor plants can improve your life in small but meaningful ways. Some benefits include:
      </p>

      <div className="plant-characteristics">
        
        {/* Breathe Easier Section */}
        <div className="characteristic">
          <button
            className="toggle-button"
            onClick={() => toggleSection('breatheEasier')}
          >
            🌬️ Breathe Easier {visibleSections.breatheEasier ? '▲' : '▼'}
          </button>
          {visibleSections.breatheEasier && (
            <p>
              Many houseplants act as natural air purifiers, removing toxins like formaldehyde and benzene from the environment, leading to cleaner indoor air. They also increase oxygen concentration in the air.
            </p>
          )}
        </div>

        {/* Stress Less Section */}
        <div className="characteristic">
          <button
            className="toggle-button"
            onClick={() => toggleSection('stressLess')}
          >
            😌 Stress Less {visibleSections.stressLess ? '▲' : '▼'}
          </button>
          {visibleSections.stressLess && (
            <p>
              Interacting with indoor plants has been shown to reduce stress levels, helping you feel more calm and relaxed in your environment.
            </p>
          )}
        </div>

        {/* Boost Productivity Section */}
        <div className="characteristic">
          <button
            className="toggle-button"
            onClick={() => toggleSection('boostProductivity')}
          >
            💡 Boost Productivity & Creativity{' '}
            {visibleSections.boostProductivity ? '▲' : '▼'}
          </button>
          {visibleSections.boostProductivity && (
            <p>
              Plants in your workspace can boost focus, creativity, and
              motivation—making tasks more enjoyable and increasing efficiency.
            </p>
          )}
        </div>

        {/* Healthier Living Environment Section */}
        <div className="characteristic">
          <button
            className="toggle-button"
            onClick={() => toggleSection('healthierEnvironment')}
          >
            🏠 Healthier Living Environment{' '}
            {visibleSections.healthierEnvironment ? '▲' : '▼'}
          </button>
          {visibleSections.healthierEnvironment && (
            <p>
              By raising humidity levels and producing oxygen, plants can ease
              dry skin and respiratory issues, creating a more comfortable and
              healthier home.
            </p>
          )}
        </div>

        {/* Mood Enhancement Section */}
        <div className="characteristic">
          <button
            className="toggle-button"
            onClick={() => toggleSection('moodEnhancement')}
          >
            😊 Mood Enhancement {visibleSections.moodEnhancement ? '▲' : '▼'}
          </button>
          {visibleSections.moodEnhancement && (
            <p>
              Surrounding yourself with greenery can lift your mood and provide
              daily joy. Taking care of your plants means taking care of
              yourself!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
