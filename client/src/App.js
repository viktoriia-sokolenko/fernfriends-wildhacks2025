import React, { useState } from 'react';
import './App.css';

function App() {
  // State to manage the visibility of each section (all sections are initially closed)
  const [visibleSections, setVisibleSections] = useState({
    breatheEasier: false,
    stressLess: false,
    boostProductivity: false,
    healthierEnvironment: false,
    moodEnhancement: false,
    connectWithOthers: false, // New toggle for connecting with plant lovers
  });

  // Toggle visibility of a section
  const toggleSection = (section) => {
    setVisibleSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Welcome to Our Indoor Plant Care Hub! 🌱</h1>
        <p className="app-intro">
          Whether you're a seasoned plant parent or just starting out, this is your space to learn, grow, and enjoy the many perks of keeping greenery around. Indoor plants don’t just brighten a room—they can genuinely make life better in small but meaningful ways.
        </p>
      </header>

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

        {/* Connect with Others Section */}
        <div className="characteristic">
          <button
            className="toggle-button"
            onClick={() => toggleSection('connectWithOthers')}
          >
            🌿 Connect with Other Plant Lovers {visibleSections.connectWithOthers ? '▲' : '▼'}
          </button>
          {visibleSections.connectWithOthers && (
            <p>
              Our platform allows you to connect with fellow plant enthusiasts! You can find them on the leaderboard, search by location, and connect to share tips, tricks, and plant care advice.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
