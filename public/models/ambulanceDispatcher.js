// Ambulance Dispatcher Model

const mongoose = require('mongoose'); 

const ambulanceDispatcherSchema = new mongoose.Schema({});
ambulanceDispatcherSchema.add(userSchema);

const AmbulanceDispatcher = mongoose.model('AmbulanceDispatcher', ambulanceDispatcherSchema);

module.exports = AmbulanceDispatcher; 