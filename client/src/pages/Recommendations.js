import { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDe2u19c_A3LO_35gF4PCEvwKMqUrwD_Lk" });

const prompt = `I’d like to grow a plant in my house. The spot has bright, direct sunlight. I also want it to be low maintenance, meaning I water it as little as possible. My room is generally dry and cool. I don’t have pets or children. I’d like it to be a flowering plant. It should also be cheap.

Please give me three plant recommendations with a description of how the characteristics of each relate to my preferences in JSON format. Please also include simple graphic examples of each plant.`;

async function gemini(formData) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config: {
      systemInstruction: "You are a expert gardener with a broad knowledge of various plants used for indoor decor.",
    },
  });
  alert(response.text);
}

function Recommendations() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

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
    <form onSubmit={handleSubmit}>
      <label>Enter your name:
      <select value={formData.username} onChange={handleChange}>
        <option value="Ford">Ford</option>
        <option value="Volvo">Volvo</option>
        <option value="Fiat">Fiat</option>
      </select>
      </label>
      <input type="submit" />
    </form>
  )
}

export default Recommendations;
