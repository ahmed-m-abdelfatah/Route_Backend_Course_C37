const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

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
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  console.log(this);
  this.phone = CryptoJS.AES.encrypt(this.phone.toString(), 'secret key 123').toString();
  next();
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
