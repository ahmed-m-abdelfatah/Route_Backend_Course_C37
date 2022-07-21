const ProductModel = require('../../DB/model/product_model.js');

const addProduct = (req, res) => {
  const { id } = req.user;

  ProductModel.create({ createdBy: id, ...req.body })
    .then(product => {
      res.json({
        message: 'Product added successfully',
        product,
      });
    })
    .catch(err => {
      res.json({
        message: 'Product add error',
        err,
      });
    });
};

const updateProduct = (req, res) => {
  const { productId } = req.body;

  ProductModel.findByIdAndUpdate(productId, req.body, { new: true })
    .then(product => {
      if (!product) {
        return res.json({
          message: 'Product not found',
        });
      }

      res.json({
        message: 'Product updated successfully',
        product,
      });
    })
    .catch(err => {
      res.json({
        message: 'Product update error',
        err,
      });
    });
};

const deleteProduct = (req, res) => {
  const { productId } = req.body;

  ProductModel.findByIdAndDelete(productId)
    .then(product => {
      if (!product) {
        return res.json({
          message: 'Product not found',
        });
      }

      res.json({
        message: 'Product deleted successfully',
      });
    })
    .catch(err => {
      res.json({
        message: 'Product delete error',
        err,
      });
    });
};

const getAllProductsWithTheirOwnerInformations = (req, res) => {
  ProductModel.find({})
    .populate('createdBy', '-password')
    .then(products => {
      res.json({
        message: 'Get all products with their owner informations successfully',
        products,
      });
    })
    .catch(err => {
      res.json({
        message: 'Get all products with their owner informations error',
        err,
      });
    });
};

const getAllProductsForSepcificUser = (req, res) => {
  const { userId } = req.query;
  console.log('~ userId', userId);

  if (!userId) {
    return res.json({
      message: 'You have to provide user id using query params',
    });
  }

  ProductModel.find({ createdBy: userId })
    // .populate('createdBy', '-password') // If You want to add user data to each product
    .then(products => {
      res.json({
        message: 'Get all products for sepcific user successfully',
        products,
      });
    })
    .catch(err => {
      res.json({
        message: 'Get all products for sepcific user error',
        err,
      });
    });
};

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProductsWithTheirOwnerInformations,
  getAllProductsForSepcificUser,
};
