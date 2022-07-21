const commentModel = require('../../DB/model/comment_model.js');
const productModel = require('../../DB/model/product_model.js');
const userModel = require('../../DB/model/user_model.js');
const { roles } = require('../../middleware/auth.js');
const { getIo, socketEvents } = require('../../services/socket.js');
const internalServerError = require('../../utils/internal_server_error.js');

const addComment = async (req, res) => {
  try {
    const { productId, commentBody } = req.body;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const comment = await commentModel.create({ productId, commentBody, createdBy: req.user._id });

    // add comment id to product
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      { $push: { comments: comment._id } },
      { new: true },
    );

    // socket io inform all open users
    const socketUser = await userModel.findById(req.user._id).select('socketId');
    getIo().except(socketUser.socketId).emit(socketEvents.addComment, [updatedProduct]);

    res.status(201).json({ message: 'Done', comment }); // 201 Created
  } catch (error) {
    internalServerError(res, error);
  }
};

const addReply = async (req, res) => {
  try {
    const { productId, commentId } = req.params;
    const { replyContent } = req.body;

    // find product and comment
    const product = await productModel.findById(productId);
    const comment = await commentModel.findOne({ _id: commentId, post: productId });

    if (!product || !comment) {
      return res.status(404).json({ message: 'Product or comment not found' }); // 404 Not Found
    }

    // check comment or post are deleted
    if (product.isDeleted || comment.isDeleted) {
      return res.status(404).json({ message: 'Product or comment not found' }); // 404 Not Found
    }

    const reply = await commentModel.create({
      productId,
      commentBody: replyContent,
      type: 'reply',
      createdBy: req.user._id,
    });

    // add reply id to comment
    const updatedComment = await commentModel.findByIdAndUpdate(commentId, { $push: { replies: reply._id } });

    // socket io inform all open users
    const socketUser = await userModel.findById(req.user._id).select('socketId');
    getIo().except(socketUser.socketId).emit(socketEvents.addReply, [updatedComment]);

    res.status(201).json({ message: 'Done', reply }); // 201 Created
  } catch (error) {
    internalServerError(res, error);
  }
};

const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { commentBody } = req.body;
    const comment = await commentModel.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { commentBody },
      { new: true },
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found, or you are not authorized to edit this comment' }); // 404 Not Found
    }

    res.status(200).json({ message: 'Done', comment }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // check comment owner or product owner
    const comment = await commentModel.findById(id);
    const product = await productModel.findById(comment.productId);

    if (!comment || !product || comment.isDeleted || product.isDeleted) {
      return res.status(404).json({ message: 'Comment not found' }); // 404 Not Found
    }

    if (
      comment.createdBy.toString() !== req.user._id.toString() &&
      product.createdBy.toString() !== req.user._id.toString()
    ) {
      // you are not the one who created the comment or the product owner, then why you are here
      return res.status(403).json({ message: 'You are not authorized to delete this comment' }); // 403 Forbidden
    }

    // delete comment
    const deletedComment = await commentModel.findByIdAndDelete(id);
    console.log('~ deletedComment', deletedComment);

    // remove comment id from post
    await productModel.findByIdAndUpdate(deletedComment.productId, { $pull: { comments: deletedComment._id } });

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

module.exports = { addComment, addReply, updateComment, deleteComment, likeComment };
