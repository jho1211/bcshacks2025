// Login User Model


const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    callSign: { type: String, required: true, unique: true },
    location: { 
        lat: Number, 
        lng: Number 
    },
    transcript: { type: String, required: true},
  });
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User; 