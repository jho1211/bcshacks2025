const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['police_officer', 'police_dispatcher', 'ambulance_dispatcher'], required: true },
    active: { type: Boolean, default: true }
  });
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User; 