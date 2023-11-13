const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'secret-key', resave: true, saveUninitialized: true }));

// In-memory user data (for simplicity)
const users = [];

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});


app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  if (users.some(user => user.username === username)) {
    return res.send('Username already exists. Please choose another.');
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  // Store the user data
  users.push({ username, password: hashedPassword });

  res.send('Registration successful! You can now <a href="/login">login</a>.');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = users.find(user => user.username === username);

  // Check if the user exists and the password is correct
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = username;
    return res.redirect('/secured');
  }

  res.send('Invalid username or password. <a href="/login">Try again</a>.');
});

app.get('/secured', (req, res) => {
  // Check if the user is authenticated
  if (req.session.user) {
    res.send(`Welcome, ${req.session.user}! This is a secured page.`);
  } else {
    res.redirect('/login');
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
