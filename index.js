const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./api/routes/auth');

const app = express();
const PORT = 3000;

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/myapp')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());

app.use('/api', authRoutes);

app.get('/', (req, res) => {
  res.send('Hello Welcome to our app ');
});

app.listen(PORT, () => {
  console.log(`🚀  Server listening at http://localhost:${PORT}`);
});
