const commentModel = require('../../DB/model/comment_model.js');
const postModel = require('../../DB/model/post_model.js');
const { roles } = require('../../middleware/auth.js');
const internalServerError = require('../../utils/internal_server_error.js');

const addComment = async (req, res) => {
  try {
    const { postId: post, commentContent } = req.body;
    const comment = await commentModel.create({ post, commentContent, createdBy: req.user._id });

    // add comment id to post
    await postModel.findByIdAndUpdate(post, { $push: { comments: comment._id } });

    res.status(201).json({ message: 'Done', comment }); // 201 Created
  } catch (error) {
    internalServerError(res, error);
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentContent } = req.body;
    const comment = await commentModel.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { commentContent },
      { new: true },
    );

    res.status(200).json({ message: 'Done', comment }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // check comment owner or admin
    const comment = await commentModel.findById(id);
    if (comment.createdBy.toString() !== req.user._id.toString() && req.user.role !== roles.Admin) {
      return res.status(401).json({ message: 'Unauthorized' }); // 401 Unauthorized
    }

    const softDeleteComment = await commentModel.findOneAndUpdate(
      { _id: id },
      { isDeleted: true, deletedBy: req.user._id, deletedAt: Date.now() },
      { new: true },
    );

    // remove comment id from post
    await postModel.findByIdAndUpdate(softDeleteComment.post, { $pull: { comments: softDeleteComment._id } });

    res.status(200).json({ message: 'Done' }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;
    const comment = await commentModel.findById(id);

    if (!comment || comment.isDeleted) {
      return res.status(404).json({ message: 'Comment not found' }); // 404 Not Found
    }

    if (comment.createdBy.toString() === currentUserId.toString()) {
      return res.status(400).json({ message: 'You cannot like your own comment' }); // 400 Bad Request
    }

    const likes = comment.likes.includes(currentUserId)
      ? comment.likes.filter(user => user.toString() !== currentUserId.toString())
      : [...comment.likes, currentUserId];

    const updatedComment = await commentModel.findByIdAndUpdate(id, { likes }, { new: true });

    res.status(200).json({ message: 'Done', updatedComment }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const addReply = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { replyContent } = req.body;

    // find post and comment
    const post = await postModel.findById(postId);
    const comment = await commentModel.findOne({ _id: commentId, post: postId });

    if (!post || !comment) {
      return res.status(404).json({ message: 'Post or comment not found' }); // 404 Not Found
    }

    // check comment or post are deleted
    if (post.isDeleted || comment.isDeleted) {
      return res.status(404).json({ message: 'Post or comment not found' }); // 404 Not Found
    }

    const reply = await commentModel.create({
      post: postId,
      commentContent: replyContent,
      createdBy: req.user._id,
    });

    // add reply id to comment
    await commentModel.findByIdAndUpdate(commentId, { $push: { replies: reply._id } });

    res.status(201).json({ message: 'Done', reply }); // 201 Created
  } catch (error) {
    internalServerError(res, error);
  }
};

module.exports = { addComment, updateComment, deleteComment, likeComment, addReply };
