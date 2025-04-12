const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true,
  },
  clockIn: {
    type: Date,
    required: true,
  },
  clockOut: {
    type: Date,
    default: null,
  },
  totalHours: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('TimeEntry', timeEntrySchema); 