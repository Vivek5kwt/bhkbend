const bcrypt = require('bcryptjs');
const Customer = require('../models/customer');
const Maid = require('../models/maid');

function getModelByRole(role) {
  if (role === 'customer') return Customer;
  if (role === 'maid') return Maid;
  return null;
}

exports.signup = async (req, res) => {
  try {
    const { role } = req.params;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const Model = getModelByRole(role);
    if (!Model) return res.status(400).json({ message: 'Invalid role' });

    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await Model.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = new Model({ email: normalizedEmail, password: hashed });
    await user.save();

    return res.status(201).json({ message: 'Signup successful', id: user._id });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { role } = req.params;
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const Model = getModelByRole(role);
    if (!Model) return res.status(400).json({ message: 'Invalid role' });

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await Model.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
