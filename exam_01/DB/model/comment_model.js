const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    commentBody: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    type: { type: String, enum: ['comment', 'reply'], default: 'comment' },
    deletedAt: Date,
  },
  { timestamps: true },
);

const commentModel = mongoose.model('Comment', commentSchema);

module.exports = commentModel;
