const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    emailConfirmed: { type: Boolean, default: false },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female'] },
    follower: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    role: { type: String, enum: ['user', 'admin', 'hr'], default: 'user' },
    isBlocked: { type: Boolean, default: false },
    isDeactivated: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    firstName: String,
    lastName: String,
    phone: String,
    code: String,
    profilePic: String,
    coverPic: Array,
    gallery: Array,
    socialLinks: Array,
    pdfLink: String,
    lastSeen: Date,
  },
  { timestamps: true },
);

// Encrypt phone && hash password before saving
userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
  }

  if (this.phone && this.isModified('phone')) {
    // encrypt last 3 numbers of phone number and merge it with the rest of the phone number
    const phone = this.phone;
    const phoneEncrypted = CryptoJS.AES.encrypt(phone.substring(phone.length - 3), process.env.CRYPTO_SECRET_KEY);
    this.phone = phone.substring(0, phone.length - 3) + phoneEncrypted.toString();
  }

  next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  // Update version before updating
  const hookData = await this.model.findOne(this.getQuery()).select('__v phone ');
  this.set({ __v: hookData.__v + 1 });

  next();
});

userSchema.post('findOneAndUpdate', async function (result) {
  if (result.phone || result.phone != null) {
    // encrypt last 3 numbers of phone number and merge it with the rest of the phone number
    const phone = result.phone;
    const phoneEncrypted = CryptoJS.AES.encrypt(phone.substring(phone.length - 3), process.env.CRYPTO_SECRET_KEY);
    result.phone = phone.substring(0, phone.length - 3) + phoneEncrypted.toString(CryptoJS.enc.Utf8);
  }
});

// userSchema.post('findOne', async function (result) {
//   if (result) {
//     // For fixing null users
//     if (result.phone || result.phone != null) {
//       const cipherText = result.phone.substring(8);
//       const plainText = CryptoJS.AES.decrypt(cipherText, process.env.CRYPTO_SECRET_KEY).toString(CryptoJS.enc.Utf8);

//       // FIXME even after splitting numbers from cipherText it isn't working
//       console.log('~ cipherText', cipherText);
//       console.log('~ plainText', plainText);

//       result.phone = result.phone.substring(0, 8) + plainText;
//     }
//   }
// });

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
