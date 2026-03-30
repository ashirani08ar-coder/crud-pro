const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Fake database (No MongoDB needed)
let tasks = [];
let idCounter = 1;

// Routes
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/api/tasks