// Police Officer Model

const mongoose = require('mongoose'); 

const policeOfficerSchema = new mongoose.Schema({
    callSign: { type: String, required: true},
    badgeNumber: { type: String, required: true, unique: true },
    rank: { enum: ['constable', 'sergeant', 'staff sergeant'], required: true },
    precinct: { type: String, required: true }
});

const Police = mongoose.model('Police', policeOfficerSchema);

module.exports = Police; 