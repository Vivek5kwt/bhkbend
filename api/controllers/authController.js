const Customer = require('../models/Customer');
const Maid = require('../models/Maid');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

exports.socialLogin = async (req, res) => {
  const { role } = req.params;
  const { provider, token } = req.body;
  if (!provider || !token) {
    return res.status(400).json({ message: 'Provider and token are required' });
  }
  const Model = role === 'customer' ? Customer : role === 'maid' ? Maid : null;
  if (!Model) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    let email;
    if (provider === 'google') {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload && payload.email;
    } else if (provider === 'facebook') {
      const response = await fetch(
        `https://graph.facebook.com/me?fields=email&access_token=${token}`
      );
      const data = await response.json();
      email = data.email;
    } else {
      return res.status(400).json({ message: 'Unsupported provider' });
    }

    if (!email) {
      return res.status(400).json({ message: 'Unable to retrieve email from provider' });
    }

    let user = await Model.findOne({ email });
    if (!user) {
      user = new Model({ email });
      await user.save();
    }
    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(401).json({ message: 'Invalid social token' });
  }
};
