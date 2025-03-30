// Police Officer Model

const mongoose = require('mongoose'); 

const policeOfficerSchema = new mongoose.Schema({});
policeOfficerSchema.add(userSchema);
policeOfficerSchema.add({
    callSign: { type: String, required: true},
    rank: { type: String, enum: ['constable', 'sergeant', 'staff sergeant'], required: true },
});

const Police = mongoose.model('Police', policeOfficerSchema);

module.exports = Police; 

// async function createPoliceOfficer() {
//     try {
//       const officer = new Police({
//         username: "jane_doe",
//         firstName: 'Jane',
//         lastName: 'Doe',
//         badgeNumber: "1234",
//         precinct: "", 
//         passwordHash: { type: String, required: true },
//         role: { type: String, enum: ['police_officer', 'police_dispatcher', 'ambulance_dispatcher'], required: true },
//         active: { type: Boolean, default: true }
//       });
  
//       await officer.save();
//       console.log('✅ Officer saved:', officer);
//     } catch (error) {
//       console.error('❌ Error creating officer:', error.message);
//     } finally {
//       mongoose.connection.close();
//     }
//   }
  
//   createPoliceOfficer();