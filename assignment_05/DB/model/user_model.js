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
      required: true,
    },
    emailConfirmed: {
      type: Boolean,
      default: false,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  // Hash the password
  this.password = await bcrypt.hash(this.password, +process.env.saltRound);

  // encrypt last 3 numbers of phone number and merge it with the rest of the phone number
  const phone = this.phone;
  const phoneEncrypted = CryptoJS.AES.encrypt(phone.substring(phone.length - 3), process.env.ENCRYPTION_SECRET_KEY);
  this.phone = phone.substring(0, phone.length - 3) + phoneEncrypted.toString();

  next();
});

// TODO can't update
// userSchema.post('findOneAndUpdate', async function () {
//   const docToUpdate = await this.model.findOne(this.getQuery());
//   console.log(docToUpdate); // The document that `findOneAndUpdate()` will modify

//   // increment the version number
//   docToUpdate.__v++;

//   // encrypt last 3 numbers of phone number and merge it with the rest of the phone number
//   const phone = docToUpdate.phone;
//   const phoneEncrypted = CryptoJS.AES.encrypt(phone.substring(phone.length - 3), process.env.ENCRYPTION_SECRET_KEY);
//   docToUpdate.phone = phone.substring(0, phone.length - 3) + phoneEncrypted.toString();
//   console.log(docToUpdate);
// });

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
