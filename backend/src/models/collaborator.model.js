const mongoose = require('mongoose');

const collaboratorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A name is required"],
      maxlength: 250
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    }
  },
  {
    timestamps: true,
  }
);

const Collaborator = mongoose.model('Collaborator', collaboratorSchema);

module.exports = Collaborator;