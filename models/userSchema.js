// Login User Model


const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true},
    lastName: { type: String, required: true},
    badgeNumber: { type: String, required: true },
    precinct: {type: String, required: true }, 
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['police_officer', 'police_dispatcher', 'ambulance_dispatcher'], required: true },
    active: { type: Boolean, default: true }
  });
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User; 