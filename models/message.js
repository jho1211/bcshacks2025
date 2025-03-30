// Chat Message Model


const mongoose = require('mongoose'); 

const messageSchema = new mongoose.Schema({
    senderCallSign: { type: String, required: true},
    message: { type: String, required: true},
    timeStamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message; 

// m = new Message(...)
// m.save()