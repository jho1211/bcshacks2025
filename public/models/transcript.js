// Transcript Model


const mongoose = require('mongoose'); 

const transcriptSchema = new mongoose.Schema({
    callSign: { type: String, required: true},
    dispatcherId: { type: String, required: true },
    transcript: { type: String, required: true},
    timeStamp: { type: String, default: Date.now },
    location: { 
        lat: Number, 
        lng: Number 
    },
    callId: { type: String },
    isEmergency: { type: Boolean, default: false },
    transcriptionStatus: { 
        type: String, 
        enum: ['pending', 'processing', 'completed', 'error'],
        default: 'pending'
    }
});

const Transcript = mongoose.model('Transcript', transcriptSchema);

module.exports = Transcript; 