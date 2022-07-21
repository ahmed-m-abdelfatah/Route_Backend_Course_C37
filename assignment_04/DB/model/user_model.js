const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: Number,
    emailConfirmed: {
      type: Boolean,
      default: false,
    },
    location: {
      type: String,
    },
    softDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
