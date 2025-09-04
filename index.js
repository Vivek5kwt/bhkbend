require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./api/routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/myapp';

// Middleware
app.use(cors({
  origin: '*', // allow all for dev; restrict in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors()); // handle preflight requests

app.use(express.json());
app.use(morgan('dev'));

// Database
mongoose.set('strictQuery', true);
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err?.message || err);
    process.exit(1);
  });

// Routes
app.use('/api', authRoutes);

// Debug: list all registered routes (helps catch 404 issues)
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`🔗 Route registered: ${Object.keys(r.route.methods).join(',').toUpperCase()} ${r.route.path}`);
  }
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/', (_req, res) => {
  res.send('Hello Welcome to our app');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.originalUrl });
});

// Start server — bind to 0.0.0.0 so other machines can reach it
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server listening at http://0.0.0.0:${PORT}`);
  console.log(`ℹ️ From another PC use: http://<SERVER-LAN-IP>:${PORT}`);
});
