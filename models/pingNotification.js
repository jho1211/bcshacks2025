// Ping Notification Model 
//  (sending pings from police to ehs and vice versa)


const mongoose = require('mongoose'); 

const pingNotificationSchema = new mongoose.Schema({
    callId: {type: String, required: true },
    recipientType: { type: String, enum: ['police', 'ambulance', 'fire'] },
    callSign: { type: String, required: true},
    summary: { type: String, required: true},
    timeStamp: { type: String, default: Date.now },
    location: { 
        lat: Number, 
        lng: Number 
    },
    isEmergency: { type: Boolean, default: false }
});

const PingNotification = mongoose.model('PingNotification', pingNotificationSchema);

module.exports = PingNotification; 