const mongoose = require('mongoose');

const timeTrackerSchema = new mongoose.Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function(value) {
          return value > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
    timeZoneId: {
      type: String,
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required: true,
    },
    collaborator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collaborator',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

timeTrackerSchema.index(
  { collaborator: 1, startDate: 1, endDate: 1 },
  { unique: true }
);

const TimeTracker = mongoose.model('TimeTracker', timeTrackerSchema);
module.exports = TimeTracker;