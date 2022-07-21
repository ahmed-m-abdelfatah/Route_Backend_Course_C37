const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    commentContent: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deletedAt: { type: Date },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true },
);

const commentModel = mongoose.model('Comment', commentSchema);

module.exports = commentModel;
