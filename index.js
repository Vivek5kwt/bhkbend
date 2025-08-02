const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Welcome to our app ');
});

// In-memory user store for demo purposes
// Each user has an id, name and password
const users = [{ id: 1, name: 'John', password: 'secret' }];

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', (req, res) => {
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Login route
// Expects JSON body with "name" and "password" fields
// Responds with a success message when credentials match
// otherwise returns 401 Unauthorized
app.post('/login', (req, res) => {
  const { name, password } = req.body;
  const user = users.find(u => u.name === name && u.password === password);
  if (user) {
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`🚀  Server listening at http://localhost:${PORT}`);
  });
}

module.exports = app;
