import React, { useEffect, useState } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [texte, setTexte] = useState('');

  // Charger les tâches au démarrage
  useEffect(() => {
    fetch('http://localhost:3001/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error('Erreur chargement:', err));
  }, []);

  // Ajouter une tâche
  const ajouterTache = () => {
    if (texte.trim() === '') return;
    fetch('http://localhost:3001/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texte })
    })
    .then(res => res.json())
    .then(newTodo => {
      setTodos([...todos, newTodo]);
      setTexte('');
    })
    .catch(err => console.error('Erreur ajout:', err));
  };

  // Supprimer une tâche
  const supprimerTache = (id) => {
    fetch(`http://localhost:3001/api/todos/${id}`, {
      method: 'DELETE'
    })
    .then(() => {
      setTodos(todos.filter(todo => todo.id !== id));
    })
    .catch(err => console.error('Erreur suppression:', err));
  };

  // Changer l'état fait / pas fait
  const basculerFait = (id, done) => {
    fetch(`http://localhost:3001/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !done })
    })
    .then(res => res.json())
    .then(updated => {
      setTodos(todos.map(t => (t.id === updated.id ? updated : t)));
    })
    .catch(err => console.error('Erreur mise à jour:', err));
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>📝 Ma ToDo List</h1>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={texte}
          onChange={e => setTexte(e.target.value)}
          placeholder="Nouvelle tâche..."
          style={{ padding: '0.5rem', width: '300px' }}
        />
        <button onClick={ajouterTache} style={{ marginLeft: '0.5rem', padding: '0.5rem' }}>
          Ajouter
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => basculerFait(todo.id, todo.done)}
              style={{ marginRight: '0.5rem' }}
            />
            <span style={{
              textDecoration: todo.done ? 'line-through' : 'none',
              flex: 1
            }}>
              {todo.texte}
            </span>
            <button onClick={() => supprimerTache(todo.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
