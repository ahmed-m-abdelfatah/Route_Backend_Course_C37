const { userModel, productModel, commentModel } = require('../../DB/models.js');

const addComment = (req, res) => {
  const { productId, userId, comment } = req.body;

  userModel
    .findOne({ where: { id: userId } })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      return productModel.findOne({ where: { id: productId } });
    })
    .then(product => {
      if (!product) {
        return res.status(404).send({ message: 'Product not found' });
      }
      return commentModel.create({
        userId,
        productId,
        comment,
      });
    })
    .then(comment => {
      res.status(200).send({ message: 'Comment added', comment });
    })
    .catch(err => {
      res.status(500).send({ message: 'Error adding comment', err });
    });
};

const displayAllComments = (req, res) => {};
module.exports = { addComment, displayAllComments };
