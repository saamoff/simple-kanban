const mongoose = require('mongoose');

const timeTrackerSchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
      validate: {
        validator: function(value) {
          return !value || value > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    timeZone: {
      type: String,
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

timeTrackerSchema.index(
  { task: 1, startDate: 1, endDate: 1 },
  { unique: true, partialFilterExpression: { endDate: { $exists: true } } }
);

const TimeTracker = mongoose.model('TimeTracker', timeTrackerSchema);
module.exports = TimeTracker;