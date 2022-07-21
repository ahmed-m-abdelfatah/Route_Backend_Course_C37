const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    emailConfirmed: { type: Boolean, default: false },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }],
    code: String,
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  // Hash the password before saving the user model
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, parseInt(process.env.BCRYPT_JS_SALT_ROUNDS));
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

    // hash the password before saving the user model
    if (this._update.password) {
      console.log('~ this._update.password', this._update.password);
      this._update.password = await bcrypt.hash(this._update.password, parseInt(process.env.BCRYPT_JS_SALT_ROUNDS));
    }
  }

  next();
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
