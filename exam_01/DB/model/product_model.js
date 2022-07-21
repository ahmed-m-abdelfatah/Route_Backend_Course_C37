const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productTitle: { type: String, required: true },
    productDesc: { type: String, required: true },
    productPrice: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isHidden: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    deletedAt: Date,
    qrCode: String,
  },
  { timestamps: true },
);

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;
