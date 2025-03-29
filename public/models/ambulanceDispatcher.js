const mongoose = require('mongoose'); 

const ambulanceDispatcherSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    badgeNumber: { type: String, required: true },
    centre: {type: String, required: true }, 
});

const AmbulanceDispatcher = mongoose.model('AmbulanceDispatcher', ambulanceDispatcherSchema);

module.exports = AmbulanceDispatcher; 