const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for tasks (replace with database in production)
let tasks = [];
let nextId = 1;

app.get('/api/tasks', (req, res) => {
  if (tasks.length === 0) {
    return res.json({
      success: true,
      message: "🎉 No tasks yet! Create your first task.",
      total: 0,
      data: [],
      vibe: "Ashu babu backend is glowing ✨"
    });
  }

  res.json({
    success: true,
    total: tasks.length,
    data: tasks
  });
});

// GET single task by ID
app.get('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  res.json(task);
});

// CREATE new task
app.post('/api/tasks', (req, res) => {
  const { title, description, completed = false } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const newTask = {
    id: nextId++,
    title: title.trim(),
    description: description ? description.trim() : '',
    completed,
    createdAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// UPDATE task by ID
app.put('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const { title, description, completed } = req.body;
  
  if (title !== undefined) tasks[taskIndex].title = title.trim();
  if (description !== undefined) tasks[taskIndex].description = description.trim();
  if (completed !== undefined) tasks[taskIndex].completed = Boolean(completed);
  
  tasks[taskIndex].updatedAt = new Date().toISOString();
  
  res.json(tasks[taskIndex]);
});

// DELETE task by ID
app.delete('/api/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve frontend (if you have one)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  GET    /api/tasks - Get all tasks`);
  console.log(`  GET    /api/tasks/:id - Get task by ID`);
  console.log(`  POST   /api/tasks - Create new task`);
  console.log(`  PUT    /api/tasks/:id - Update task`);
  console.log(`  DELETE /api/tasks/:id - Delete task`);
});

module.exports = app;