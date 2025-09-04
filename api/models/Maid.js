const mongoose = require('mongoose');

<<<<<<< HEAD
const maidSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
  },
  { timestamps: true }
);
=======
const maidSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  // Password is optional to support social login accounts
  password: { type: String }
});
>>>>>>> 84e15191efbb45457cf7de11ec65232f5499f740

module.exports = mongoose.model('Maid', maidSchema);
