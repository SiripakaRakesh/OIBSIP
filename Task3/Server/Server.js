const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 4000;

app.use(cors()); 
app.use(bodyParser.json());

let tasks = [];

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const task = req.body;
    tasks.push(task);
    res.json(task);
});

app.put('/tasks/:text', (req, res) => {
    const textToUpdate = req.params.text;
    const updatedTask = req.body;

    tasks = tasks.map(task => (task.text === textToUpdate ? { ...task, ...updatedTask } : task));

    res.json(updatedTask);
});

app.delete('/tasks/:text', (req, res) => {
    const textToDelete = req.params.text;

    tasks = tasks.filter(task => task.text !== textToDelete);

    res.json({ text: textToDelete });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
