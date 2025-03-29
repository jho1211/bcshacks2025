// Police Dispatcher Model


const mongoose = require('mongoose'); 

const policeDispatcherSchema = new mongoose.Schema({});
policeDispatcherSchema.add(userSchema);

const PoliceDispatcher = mongoose.model('PoliceDispatcher', policeDispatcherSchema);

module.exports = PoliceDispatcher; 