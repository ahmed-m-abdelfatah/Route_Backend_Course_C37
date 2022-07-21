const commentModel = require('../../DB/model/comment_model.js');
const productModel = require('../../DB/model/product_model.js');
const userModel = require('../../DB/model/user_model.js');
const { roles } = require('../../middleware/auth.js');
const sendEmail = require('../../services/email.js');
const pagination = require('../../services/pagination.js');
const internalServerError = require('../../utils/internal_server_error.js');

const getAllUsers = async (req, res) => {
  try {
    let searchFilter;

    switch (req.user.role) {
      case roles.Admin: {
        searchFilter = { $or: [{ role: roles.user }] };
        break;
      }

      default: {
        return res.status(401).json({ message: 'User not authorized' }); // 401 Unauthorized
      }
    }

    // get all products with each user child parent
    const { page, size } = req.query;
    const { skip, limit } = pagination(page, size);

    const cursor = userModel
      .find(searchFilter)
      .limit(limit)
      .skip(skip)
      .populate({
        path: 'wishlist',
      })
      .cursor();

    const users = [];

    for (let user = await cursor.next(); user != null; user = await cursor.next()) {
      const products = await productModel.find({ createdBy: user._id }).populate({
        path: 'comments',
        match: { isDeleted: false },
        select: 'commentBody type',
        populate: {
          path: 'replies',
          match: { isDeleted: false },
          select: 'commentBody type',
          populate: {
            path: 'replies',
            match: { isDeleted: false },
            select: 'commentBody type',
          },
        },
      });

      users.push({ ...user.toJSON(), products });
    }

    res.status(200).json({ message: 'Done', users }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const changeRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (id === req.user.id) {
      return res.status(400).json({ message: 'You can not change your own role' }); // 400 Bad Request
    }

    const user = await userModel.findOneAndUpdate({ _id: id }, { role });

    sendEmail(user.email, 'ROLE CHANGED', `<h1>Admin changed your privilege to ${role}</h1>`);
    res.status(200).json({ message: 'Done', user }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const blockUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ message: 'You can not block your own account' }); // 400 Bad Request
    }

    const user = await userModel.findOneAndUpdate({ _id: id }, { isBlocked: true });
    sendEmail(user.email, 'BLOCKED', `<h1>${req.user.role} blocked your account</h1>`);
    res.status(200).json({ message: 'Done', user }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ message: 'You can not delete your own account' }); // 400 Bad Request
    }

    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // 404 Not Found
    }

    sendEmail(user.email, 'DELETED', `<h1>${req.user.role} deleted your account for real</h1>`);

    res.status(200).json({ message: 'Done', user }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const softDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({ message: 'You can not delete your own account' }); // 400 Bad Request
    }

    const user = await userModel.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedBy: req.user.id,
      deletedAt: Date.now(),
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // 404 Not Found
    }

    sendEmail(user.email, 'DELETED', `<h1>${req.user.role} deleted your account</h1>`);

    res.status(200).json({ message: 'Done', user }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' }); // 404 Not Found
    }

    res.status(200).json({ message: 'Done', product }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const softDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productModel.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedBy: req.user.id,
      deletedAt: Date.now(),
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' }); // 404 Not Found
    }

    res.status(200).json({ message: 'Done', product }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const softDeleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await commentModel.findByIdAndUpdate(
      id,
      {
        isDeleted: true,
        deletedBy: req.user.id,
        deletedAt: Date.now(),
      },
      { new: true },
    );

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' }); // 404 Not Found
    }

    res.status(200).json({ message: 'Done', comment }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

module.exports = {
  getAllUsers,
  changeRole,
  blockUser,
  deleteUser,
  softDeleteUser,
  deleteProduct,
  softDeleteProduct,
  softDeleteComment,
};
