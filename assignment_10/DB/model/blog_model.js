const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pics: Array,
  },
  { timestamps: true },
);

const blogModel = mongoose.model('Blog', blogSchema);

module.exports = blogModel;
