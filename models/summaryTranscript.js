const mongoose = require('mongoose'); 

const summarySchema = new mongoose.Schema({
    callSigns: [{ type: String }],
    original: { type: String, required: false },
    summary: { type: String, required: true},
    minTimestamp: { type: Number, default: Date.now() },
    maxTimestamp: { type: Number, default: Date.now() },
    unit: { type: String, enum: ["Police", "EHS"], required: true }
});

const SummaryTranscript = mongoose.model('SummaryTranscript', summarySchema);

module.exports = SummaryTranscript;