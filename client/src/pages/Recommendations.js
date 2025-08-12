import { React, useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_KEY });

const prompt = `I’d like to grow a plant in my house.

Please give me three recommendations and describe how each of their characteristics relate to my preferences, responding with the same language as the query. The preferences are in JSON format below:

`;

const questions = {
  light: "How much natural light does your space get?",
  water: "How often do you want to water your plant?",
  experience: "What's your experience with houseplants?",
  pets: "Do you have pets or small children?",
  temperature: "What is the average temperature in your home?",
  humidity: "What is the average humidity in your home?",
  extra: "Anything else I should know?",
};

const PlantCard = ({plant}) => {
return (
        <div className="plant-card-left">
                <h2>{plant.name}</h2>
                <p><strong> 🌿 Species:</strong> {plant.species}</p>
                <p>{plant.description}</p>
                <div className="plant-characteristics">
                    <p><strong>Light:</strong> {plant.light}</p>
                    <p><strong>Water:</strong> {plant.water}</p>
                    <p><strong>Experience:</strong> {plant.experience}</p>
                    <p><strong>Pets:</strong> {plant.pets}</p>
                    <p><strong>Temperature:</strong> {plant.temperature}</p>
                    <p><strong>Humidity:</strong> {plant.humidity}</p>
                </div>
        </div>
)
};

function Recommendations() {
  const [formData, setFormData] = useState({
    light: 'North-facing window, or very shaded',
    water: 'Every few days',
    experience: 'New to houseplants',
    pets: 'one cat',
    temperature: '60-65°F',
    humidity: 'Dry air',
    extra: 'I like plants that have interesting leaves or flowers',
  });

  const [recommended, setRecommended] = useState([
  ]);

  async function gemini(formData) {
    const renamedFormData = {};
    Object.keys(formData).forEach((key) => {
      const newKey = questions[key];
      renamedFormData[newKey] = formData[key];
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt + JSON.stringify(renamedFormData),
      config: {
        systemInstruction: "You are a expert gardener with a broad knowledge of various indoor plants.",
        responseMimeType: 'application/json',
        temperature: 2.0,
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
    setRecommended(JSON.parse(response.text));
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
    <div className='section'>
    <h1>Find your next plant!</h1>
    <form onSubmit={handleSubmit}>
      <div className="edit-form">
      <h3>Enter your preferences below</h3>
      <label>
        How much natural light does your space get?
        <textarea
          name="light"
          value={formData.light}
          onChange={handleChange}
        />
      </label>

      <label>
        How often do you want to water your plant?
        <textarea
          name="water"
          value={formData.water}
          onChange={handleChange}
        />
      </label>

      <label>
        What's your experience with houseplants?
        <textarea
          name="experience"
          value={formData.experience}
          onChange={handleChange}
        />
      </label>

      <label>
        Do you have pets or small children?
        <textarea
          name="pets"
          value={formData.pets}
          onChange={handleChange}
        />
      </label>

      <label>
        What is the average temperature in your home?
        <textarea
          name="temperature"
          value={formData.temperature}
          onChange={handleChange}
        />
      </label>

      <label>
        What is the average humidity in your home?
        <textarea
          name="humidity"
          value={formData.humidity}
          onChange={handleChange}
        />
      </label>
      <label>
        Anything else I should know? (i.e., specific plant preferences)
        <textarea
          name="extra"
          value={formData.extra}
          onChange={handleChange}
        />
      </label>
      <div className='row'>
        <button type="submit">Get Recommendations</button>
      </div>
      </div>
    </form>

  <div className='section'>
    <div className='plants-container'>
      <div className="plants-list">
        {recommended.length === 0 && <p>Your new plants are just a few clicks away...</p>}
        {recommended.map((plant) => (
          <PlantCard plant={plant} key={plant.name} />
          ))}
      </div>
    </div>
  </div>
  </div>
  )
}

export default Recommendations;
