const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');

const userSchema = new mongoose.Schema(
  {
    emailConfirmed: { type: Boolean, default: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    blocked: { type: Boolean, default: false },
    isDeactivated: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female', 'unknown'], default: 'unknown' },
    deletedAt: Date,
    LoggedInAt: Date,
    LoggedOutAt: Date,
    firstName: String,
    lastName: String,
    profilePic: Array,
    coverPic: String,
    qrCode: String,
    phone: String,
    code: String,
    socketId: String,
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  // Hash the password before saving the user model
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, parseInt(process.env.BCRYPT_JS_SALT_ROUNDS));
  }

  // Encrypt phone number
  if (this.phone && this.isModified('phone')) {
    // encrypt last 3 numbers of phone number and merge it with the rest of the phone number
    const phone = this.phone;
    const phoneEncrypted = CryptoJS.AES.encrypt(
      phone.substring(phone.length - 3),
      process.env.CRYPTO_SECRET_KEY,
    ).toString();
    this.phone = phone.substring(0, phone.length - 3) + phoneEncrypted;
  }

  next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  if (this._update && Object.keys(this._update).length > 0) {
    // Update version
    const hookData = await this.model.findOne(this.getQuery()).select('__v');

    if (hookData) {
      this.set({ __v: hookData.__v + 1 });
    }
  }

  next();
});

userSchema.post('findOneAndUpdate', async function (result) {
  if (result?.phone || result?.phone != null) {
    // encrypt last 3 numbers of phone number and merge it with the rest of the phone number
    const phone = result.phone;
    const phoneEncrypted = CryptoJS.AES.encrypt(
      phone.substring(phone.length - 3),
      process.env.CRYPTO_SECRET_KEY,
    ).toString();
    result.phone = phone.substring(0, phone.length - 3) + phoneEncrypted;
    result.save();
  }
});

userSchema.post('findOne', async function (result) {
  if (result?.phone || result?.phone != null) {
    // decrypt phone number
    const cipherText = result.phone.substring(8).toString();
    const bytes = CryptoJS.AES.decrypt(cipherText, process.env.CRYPTO_SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);

    // FIXME phone error in encrypted and decrypted
    console.log('~ result.phone', result.phone);
    console.log('~ cipherText', cipherText);
    console.log('~ phone', originalText);

    // result.phone = result.phone.substring(0, 8) + originalText;
  }
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
