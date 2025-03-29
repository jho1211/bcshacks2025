// Police Dispatcher Model


const mongoose = require('mongoose'); 

const policeDispatcherSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    badgeNumber: { type: String, required: true },
    precinct: {type: String, required: true }, 
});

const PoliceDispatcher = mongoose.model('PoliceDispatcher', policeDispatcherSchema);

module.exports = PoliceDispatcher; 