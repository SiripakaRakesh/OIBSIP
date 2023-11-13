let tasks = [];

function addTask() {
    console.log('Adding task...');
    const taskInput = document.getElementById('taskInput');
    const description = document.getElementById('description');
    const taskText = taskInput.value.trim();
    const taskDescription = description.value.trim();


    if (taskText !== '') {
        const newTask = {
            text: taskText,
            description: taskDescription,
            completed: false,
            timestamp: new Date().toLocaleString()
        };

        // Send a POST request to the server to add a new task
        fetch('http://localhost:4000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask),
        })
        .then(response => response.json())
        .then(data => {
            tasks.push(data);
            updateTasks();
            taskInput.value = '';
        })
        .catch(error => console.error('Error adding task:', error));
    }
}

function updateTasks() {
    console.log('Updating tasks...');
    const pendingTasksList = document.getElementById('pendingTasks');
    const completedTasksList = document.getElementById('completedTasks');

    pendingTasksList.innerHTML = '';
    completedTasksList.innerHTML = '';

    tasks.forEach(task => {
        const p1 = document.createElement('p');
        const p2 = document.createElement('p');
        const li = document.createElement('li');
        p1.textContent = `${task.text}`;
        p2.textContent = `${task.description}, ${task.timestamp}`;
        li.textContent = `${p1.textContent}--^--^--^--^--^--^--^--^${p2.textContent}`;
        console.log(li.textContent);

        if (task.completed) {
            li.classList.add('completed');
            completedTasksList.appendChild(li);
        } else {
            const completeButton = document.createElement('button');
            completeButton.textContent = '🗸';
            completeButton.addEventListener('click', () => completeTask(task));
            li.appendChild(completeButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.addEventListener('click', () => deleteTask(task));
            li.appendChild(deleteButton);

            pendingTasksList.appendChild(li);
        }
    });
}

function completeTask(task) {
    // Send a PUT request to the server to mark a task as completed
    fetch(`http://localhost:4000/tasks/${task.text}/${task.description}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true }),
    })
    .then(response => response.json())
    .then(updatedTask => {
        tasks = tasks.map (t => (t.text === updatedTask.text ? updatedTask : t));
        tasks = tasks.map (t => (t.description === updatedTask.description ? updatedTask : t))
        updateTasks();
    })
    .catch(error => console.error('Error completing task:', error));
}

function deleteTask(task) {
    // Send a DELETE request to the server to delete a task
    fetch(`http://localhost:4000/tasks/${task.text}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(deletedTask => {
        tasks = tasks.filter(t => t.text !== deletedTask.text);
        updateTasks();
    })
    .catch(error => console.error('Error deleting task:', error));
}

// Fetch tasks from the server when the page loads
window.addEventListener('load', () => {
    fetch('http://localhost:4000/tasks')
        .then(response => response.json())
        .then(data => {
            tasks = data;
            updateTasks();
        })
        .catch(error => console.error('Error fetching tasks:', error));
});
