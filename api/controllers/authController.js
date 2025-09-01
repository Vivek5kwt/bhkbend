const Customer = require('../models/Customer');
const Maid = require('../models/Maid');

exports.signup = async (req, res) => {
  const { role } = req.params;
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const Model = role === 'customer' ? Customer : role === 'maid' ? Maid : null;
  if (!Model) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  try {
    const existing = await Model.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }
    const user = new Model({ email, password });
    await user.save();
    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { role } = req.params;
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const Model = role === 'customer' ? Customer : role === 'maid' ? Maid : null;
  if (!Model) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  try {
    const user = await Model.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
