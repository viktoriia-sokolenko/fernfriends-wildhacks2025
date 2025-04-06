import { React, useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyBf1d4RLQAGbicb1xlCxqXJxFUfHS0oPFw" });

const prompt = `I’d like to grow a plant in my house.

Please give me three plant recommendations with a description of how the characteristics of each relate to my preferences. The questions are:

How much natural light does your space get? (Low, Medium, Bright)
How often do you want to water your plant? (Frequently, Moderately, Infrequently)
What's your experience with houseplants? (Beginner, Intermediate, Experienced)
Do you have pets or small children? (Yes, No)
What is the average temperature in your home? (Cool, Average, Warm)
What is the average humidity in your home? (Low, Average, High)

My answers are as follows:`;

const Plant = ({plant}) => {
  return (
      <div className="plant-card">
          <h2>{plant.name}</h2>
          <p>Species: {plant.species}</p>
          <p>Description: {plant.description}</p>
          <p>Light: {plant.light}</p>
          <p>Water: {plant.water}</p>
          <p>Experience: {plant.experience}</p>
          <p>Pets: {plant.pets}</p>
          <p>Temperature: {plant.temperature}</p>
          <p>Humidity: {plant.humidity}</p>
      </div>
  )
};

function Recommendations() {
  const [formData, setFormData] = useState({
    light: 'Low (North-facing window, or very shaded)',
    water: 'Frequently (Every few days)',
    experience: 'Beginner (New to houseplants)',
    pets: 'Yes',
    temperature: 'Cool (60-65°F)',
    humidity: 'Low (Dry air)',
  });

  const [recommended, setRecommended] = useState([
    {name: '', species: '', description: '', light: '', water: '', experience: '', pets: '', temperature: '', humidity: ''}
  ]);

  async function gemini(formData) {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt + JSON.stringify(formData),
      config: {
        systemInstruction: "You are a expert gardener with a broad knowledge of various plants used for indoor decor.",
        responseMimeType: 'application/json',
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    'name': {
                        type: Type.STRING,
                        description: 'The name of the plant',
                        nullable: false,
                    },
                    'species': {
                        type: Type.STRING,
                        description: 'The species of the plant',
                        nullable: false,
                    },
                    'description': {
                        type: Type.STRING,
                        description: 'A brief description of the plant and its characteristics',
                        nullable: false,
                    },
                    'light': {
                        type: Type.STRING,
                        description: 'The amount of natural light the plant needs',
                        nullable: false,
                    },
                    'water': {
                        type: Type.STRING,
                        description: 'The watering frequency of the plant',
                        nullable: false,
                    },
                    'experience': {
                        type: Type.STRING,
                        description: 'The level of experience required to care for the plant',
                        nullable: false,
                    },
                    'pets': {
                        type: Type.STRING,
                        description: 'Whether the plant is safe for pets',
                        nullable: false,
                    },
                    'temperature': {
                        type: Type.STRING,
                        description: 'The temperature range suitable for the plant',
                        nullable: false,
                    },
                    'humidity': {
                        type: Type.STRING,
                        description: 'The humidity level suitable for the plant',
                        nullable: false,
                    },
                },
                required: ['name', 'species', 'description', 'light', 'water', 'experience', 'pets', 'temperature', 'humidity'],
            },
            propertyOrdering: ['name', 'species', 'description', 'light', 'water', 'experience', 'pets', 'temperature', 'humidity' ],
        },
      },
    });
    console.log(typeof response.text);
    if (Array.isArray(JSON.parse(response.text))) {
      setRecommended(JSON.parse(response.text));
    } else {
      console.error("Response is not an array:", response.text);
    }
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData(values => ({...values, [name]: value}))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    gemini(formData);
  }

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <div className="edit-form">
      <label>
        How much natural light does your space get?
        <select value={formData.light} onChange={handleChange}>
          <option value="low">Low (North-facing window, or very shaded)</option>
          <option value="medium">Medium (East or West-facing window)</option>
          <option value="bright">Bright (South-facing window, or lots of direct sun)</option>
        </select>
      </label>

      <label>
        How often do you want to water your plant?
        <select value={formData.water} onChange={handleChange}>
          <option value="frequent">Frequently (Every few days)</option>
          <option value="moderate">Moderately (Once a week or so)</option>
          <option value="infrequent">Infrequently (Every couple of weeks or more)</option>
        </select>
      </label>

      <label>
        What's your experience with houseplants?
        <select value={formData.experience} onChange={handleChange}>
          <option value="beginner">Beginner (New to houseplants)</option>
          <option value="intermediate">Intermediate (Some experience)</option>
          <option value="experienced">Experienced (Confident with plants)</option>
        </select>
      </label>

      <label>
        Do you have pets or small children?
        <select value={formData.pets} onChange={handleChange}>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </label>

      <label>
        What is the average temperature in your home?
        <select value={formData.temperature} onChange={handleChange}>
          <option value="cool">Cool (60-65°F)</option>
          <option value="average">Average (65-75°F)</option>
          <option value="warm">Warm (75-80°F)</option>
        </select>
      </label>

      <label>
        What is the average humidity in your home?
        <select value={formData.humidity} onChange={handleChange}>
          <option value="low">Low (Dry air)</option>
          <option value="average">Average</option>
          <option value="high">High (Humid air)</option>
        </select>
      </label>
      <div className='row'>
        <button type="submit">Get Recommendations</button>
      </div>
      </div>
    </form>

  <div className='section'>
  <h1>Recommendations</h1>
    <div className='plants-container'>
      <div className="plants-list">
        {recommended.map((plant) => (
          <Plant plant={plant} key={plant.name} />
          ))}
      </div>
    </div>
  </div>
  </div>
  )
}

export default Recommendations;
