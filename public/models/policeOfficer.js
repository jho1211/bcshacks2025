// Police Officer Model

const mongoose = require('mongoose'); 

const policeOfficerSchema = new mongoose.Schema({});
policeOfficerSchema.add(userSchema);
policeOfficerSchema.add({
    callSign: { type: String, required: true},
    rank: { enum: ['constable', 'sergeant', 'staff sergeant'], required: true },
});

const Police = mongoose.model('Police', policeOfficerSchema);

module.exports = Police; 