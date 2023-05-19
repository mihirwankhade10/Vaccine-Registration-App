const mongoose = require('mongoose');

const vaccineSlotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  availableDoses: {
    type: Number,
    required: true,
  },
});

const VaccineSlot = mongoose.model('VaccineSlot', vaccineSlotSchema);

module.exports = VaccineSlot;
