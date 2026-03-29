import express from 'express';
import cors from 'cors';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

const DB = 'tasks.json';
const read = () => JSON.parse(fs.existsSync(DB) ? fs.readFileSync(DB, 'utf8') : '[]');
const write = (d) => fs.writeFileSync(DB, JSON.stringify(d));

app.get('/api/tasks', (req, res) => res.json(read()));

app.post('/api/tasks', (req, res) => {
    const tasks = read();
    const task = { id: Date.now(), ...req.body };
    tasks.push(task);
    write(tasks);
    res.json(task);
});

app.put('/api/tasks/:id', (req, res) => {
    let tasks = read();
    tasks = tasks.map(t => t.id == req.params.id ? { ...t, ...req.body } : t);
    write(tasks);
    res.json({ success: true });
});

app.delete('/api/tasks/:id', (req, res) => {
    let tasks = read().filter(t => t.id != req.params.id);
    write(tasks);
    res.json({ success: true });
});

app.listen(3000, () => console.log('Backend running on port 3000'));