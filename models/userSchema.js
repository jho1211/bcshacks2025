// Login User Model


const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    callSign: { type: String, required: true },
    location: { 
        lat: Number, 
        lng: Number 
    },
    role: { type: String, enum: ['responder', 'dispatcher'], required: true },
});
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User; 