const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // User schema fields
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  pincode: {
    type: String,
    required: true
  },
  aadharNo: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  vaccinationStatus: {
    type: String,
    enum: ['First Dose', 'Second Dose', 'Vaccinated'],
    default: 'First Dose'
  },
  registeredSlots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TimeSlot'
    }
  ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
