// Transcript Model


const mongoose = require('mongoose'); 

const transcriptSchema = new mongoose.Schema({
    callSign: { type: String, required: true},
    transcript: { type: String, required: true},
    timeStamp: { type: String, default: Date.now },
    location: { 
        lat: Number, 
        lng: Number 
    },
});

const Transcript = mongoose.model('Transcript', transcriptSchema);

module.exports = Transcript; 