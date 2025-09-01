const mongoose = require('mongoose');

const maidSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('Maid', maidSchema);
