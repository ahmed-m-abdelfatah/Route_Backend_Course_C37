const productModel = require('../../DB/model/product_model.js');
const fs = require('fs');
const QRCode = require('qrcode');
const internalServerError = require('../../utils/internal_server_error.js');
const userModel = require('../../DB/model/user_model.js');
const { getIo, socketEvents } = require('../../services/socket.js');

const addProduct = async (req, res) => {
  try {
    const product = await productModel.create({ ...req.body, createdBy: req.user._id });

    // create qr code for product
    const qrData = JSON.stringify({
      productId: product._id,
      productTitle: product.productTitle,
      productPrice: product.productPrice,
      productDesc: product.productDesc,
    });

    const qrCode = await QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' });

    product.qrCode = qrCode;
    product.save();

    // socket io inform all open users
    const socketUser = await userModel.findById(req.user._id).select('socketId');
    getIo().except(socketUser.socketId).emit(socketEvents.addProduct, [product]);

    res.status(201).json({ message: 'Done', product }); // 201 Created
  } catch (error) {
    internalServerError(res, error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { productTitle, productPrice, productDesc } = req.body;

    const product = await productModel.find({ _id: id, createdBy: req.user._id });

    if (!product || product.isDeleted || product.isHidden || product.length === 0) {
      return res.status(404).json({ message: 'Product not found' }); // 404 Not Found
    }

    // create qr code for product
    const qrData = JSON.stringify({
      productId: product._id,
      productTitle: productTitle,
      productPrice: productPrice,
      productDesc: productDesc,
    });

    const qrCode = await QRCode.toDataURL(qrData, { errorCorrectionLevel: 'H' });

    const updatedProduct = await productModel.findByIdAndUpdate(id, { ...req.body, qrCode }, { new: true });

    res.status(200).json({ message: 'Done', updatedProduct }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findOneAndDelete({ _id: id, createdBy: req.user._id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' }); // 404 Not Found
    }

    res.status(200).json({ message: 'Done' }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const softDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findOneAndUpdate(
      { _id: id, createdBy: req.user._id },
      { isDeleted: true, deletedBy: req.user._id, deletedAt: Date.now() },
      { new: true },
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' }); // 404 Not Found
    }

    res.status(200).json({ message: 'Done' }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const likeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;
    const product = await productModel.findById(id);

    if (!product || product.isDeleted || product.isHidden) {
      return res.status(404).json({ message: 'Product not found' }); // 404 Not Found
    }

    if (product.createdBy.toString() === currentUserId.toString()) {
      return res.status(400).json({ message: 'You cannot like your own product' }); // 400 Bad Request
    }

    const likes = product.likes.includes(currentUserId)
      ? product.likes.filter(user => user.toString() !== currentUserId.toString())
      : [...product.likes, currentUserId];

    const updatedProduct = await productModel.findByIdAndUpdate(id, { likes }, { new: true });

    res.status(200).json({ message: 'Done', updatedProduct }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;
    const product = await productModel.findById(id);

    if (!product || product.isDeleted || product.isHidden) {
      return res.status(404).json({ message: 'Product not found' }); // 404 Not Found
    }

    // add product to wishlist
    const wishlist = product.wishlist.includes(currentUserId);

    if (wishlist) {
      return res.status(400).json({ message: 'Product already in your wishlist' }); // 400 Bad Request
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { wishlist: [...product.wishlist, currentUserId] },
      { new: true },
    );

    // add product to user's wishlist
    console.log('~ req.user.wishlist', typeof req.user.wishlist);
    const updatedUser = await userModel.findByIdAndUpdate(
      currentUserId,
      { wishlist: [...req.user.wishlist, id] },
      { new: true },
    );

    res.status(200).json({ message: 'Done', updatedProduct, updatedUser }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const hideProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findOne({ _id: id, createdBy: req.user._id });

    if (!product || product.isDeleted) {
      return res.status(404).json({ message: 'Product not found' }); // 404 Not Found
    }

    if (product.isHidden) {
      return res.status(400).json({ message: 'Product already hidden' }); // 400 Bad Request
    }

    const updatedProduct = await productModel.findByIdAndUpdate(id, { isHidden: true }, { new: true });

    res.status(200).json({ message: 'Done', updatedProduct }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  softDeleteProduct,
  likeProduct,
  addToWishlist,
  hideProduct,
};
