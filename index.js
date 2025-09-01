const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello Welcome to our app ');
});

const users = [];

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    console.log('Signup attempt with missing credentials');
    return res
      .status(400)
      .json({ message: 'Username and password are required' });
  }

  const existing = users.find((u) => u.username === username);
  if (existing) {
    console.log(`Signup failed: user ${username} already exists`);
    return res.status(409).json({ message: 'User already exists' });
  }

  const newUser = { id: Date.now(), username, password };
  users.push(newUser);
  console.log(`User signed up: ${username}`);
  res.status(201).json({ message: 'Signup successful' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    console.log(`User logged in: ${username}`);
    return res.json({ message: 'Login successful' });
  }

  console.log(`Failed login attempt: ${username}`);
  res.status(401).json({ message: 'Invalid credentials' });
});

app.listen(PORT, () => {
  console.log(`🚀  Server listening at http://localhost:${PORT}`);
});
