const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
  // TimeSlot schema fields
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  availableSlots: {
    type: Number,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
});

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = TimeSlot;
