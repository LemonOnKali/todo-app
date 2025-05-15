const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

// Remplace par ton URL exacte  
const FIREBASE_URL = 'https://lemon-b0018-default-rtdb.europe-west1.firebasedatabase.app/todos';

app.use(cors());
app.use(express.json());

/**
 * GET /api/todos
 * Récupère la liste depuis Firebase
 */
app.get('/api/todos', async (req, res) => {
  try {
    const response = await axios.get(`${FIREBASE_URL}.json`);
    const data = response.data || {};
    const todos = Object.entries(data).map(([id, todo]) => ({ id, ...todo }));
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur Firebase (GET)' });
  }
});

/**
 * POST /api/todos
 * Crée une nouvelle tâche dans Firebase
 */
app.post('/api/todos', async (req, res) => {
  try {
    const newTodo = req.body; // { texte, done }
    const response = await axios.post(`${FIREBASE_URL}.json`, newTodo);
    res.status(201).json({ id: response.data.name, ...newTodo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur Firebase (POST)' });
  }
});

/**
 * DELETE /api/todos/:id
 * Supprime la tâche spécifiée
 */
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await axios.delete(`${FIREBASE_URL}/${id}.json`);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur Firebase (DELETE)' });
  }
});

/**
 * PUT /api/todos/:id
 * Met à jour uniquement le champ "done" d’une tâche
 */
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { done } = req.body;
    // On PATCH juste la propriété done
    await axios.patch(`${FIREBASE_URL}/${id}.json`, { done });
    // On récupère l’objet mis à jour pour renvoyer au client
    const updated = await axios.get(`${FIREBASE_URL}/${id}.json`);
    res.json({ id, ...updated.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur Firebase (PUT)' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});