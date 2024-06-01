const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = 3000;

// Configuración de la API de OpenAI con la clave desde .env
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Endpoint para obtener cuidados de una raza específica
app.get('/cuidados/:raza', async (req, res) => {
  const raza = req.params.raza;
  const prompt = `Cuidados necesarios para ${raza}:\n1. Alimentación:\n- \n2. Ejercicio:\n- \n3. Higiene:\n- \n4. Salud:\n- \n5. Entorno:\n-`;
  
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 150,
    });

    res.json({ text: response.data.choices[0].text });
  } catch (error) {
    res.status(500).send(error.response ? error.response.data : 'Error interno del servidor');
  }
});

// Endpoint para obtener compatibilidad de una raza específica
app.get('/compatibilidad/:raza', async (req, res) => {
  const raza = req.params.raza;
  const prompt = `Compatibilidad de ${raza} con otras razas:\n1. Compatibilidad Alta:\n- \n2. Compatibilidad Moderada:\n- \n3. Compatibilidad Baja:\n-`;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 150,
    });

    res.json({ text: response.data.choices[0].text });
  } catch (error) {
    res.status(500).send(error.response ? error.response.data : 'Error interno del servidor');
  }
});

// Iniciar el servidor en el puerto especificado
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});