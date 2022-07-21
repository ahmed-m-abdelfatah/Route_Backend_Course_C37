const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
    phone: {
      type: String,
    },
    emailConfirmed: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      default: 'male',
    },
    role: {
      type: String,
      default: 'user',
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (this.password) {
    // Hash the password
    this.password = await bcrypt.hash(this.password, +process.env.saltRound);
  }

  if (this.phone) {
    // encrypt last 3 numbers of phone number and merge it with the rest of the phone number
    const phone = this.phone;
    const phoneEncrypted = CryptoJS.AES.encrypt(phone.substring(phone.length - 3), process.env.ENCRYPTION_SECRET_KEY);
    this.phone = phone.substring(0, phone.length - 3) + phoneEncrypted.toString();
  }

  next();
});

// findByIdAndUpdate is a wrapper around findOneAndUpdate
// https://stackoverflow.com/a/49114797/16107539
userSchema.pre('findOneAndUpdate', async function (next) {
  // TODO encrypt last 3 numbers of phone number and merge it with the rest of the phone number
  console.log('~ this.getUpdate()', this.getUpdate());
  if (this.getUpdate().phone) {
    // encrypt last 3 numbers of phone number and merge it with the rest of the phone number
    const phone = this.getUpdate().phone;
    console.log('~ phone', phone);
    const phoneEncrypted = CryptoJS.AES.encrypt(phone.substring(phone.length - 3), process.env.ENCRYPTION_SECRET_KEY);
    this.phone = phone.substring(0, phone.length - 3) + phoneEncrypted.toString();
  }

  // update version of the document
  // console.log('~ this.model', this.model);
  // console.log('~ this.getQuery()', this.getQuery());
  const hookData = await this.model.findOne(this.getQuery()).select('__v');
  // console.log('~ hookData', hookData);
  this.set({ __v: hookData.__v + 1 });

  next();
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
