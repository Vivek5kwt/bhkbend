const mongoose = require('mongoose');

const maidSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  // Password is optional to support social login accounts
  password: { type: String }
});

module.exports = mongoose.model('Maid', maidSchema);
