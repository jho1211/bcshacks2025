// Login User Model


const mongoose = require('mongoose'); 

const userSchema = new mongoose.Schema({
    callSign: { type: String, required: true },
    location: { 
        lat: Number, 
        lng: Number 
    },
    timeStamp: { type: Date, default: Date.now },
    transcript: { type: String, required: true},
    role: { type: String, enum: ['police_officer', 'police_dispatcher', 'ambulance_dispatcher'], required: true },
});
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User; 