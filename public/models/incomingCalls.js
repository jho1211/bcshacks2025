// Incoming Calls Model


const mongoose = require('mongoose'); 

const incomingCallSchema = new mongoose.Schema({
    fileType: { type: String, required: true},
    location: { type: String, required: true },
    timeStamp: { type: Date, default: Date.now },
    priority: { enum: [1, 2, 3], required: true }
});

const IncomingCalls = mongoose.model('IncomingCalls', incomingCallSchema);

module.exports = IncomingCalls; 