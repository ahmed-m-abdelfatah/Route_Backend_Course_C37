const moment = require('moment');
const ProductModel = require('../../DB/model/product_model.js');
const userModel = require('../../DB/model/user_model.js');
const internalServerError = require('../../server_error.js');

const addProduct = async (req, res) => {
  const { id } = req.user;

  try {
    // Create new product
    const product = new ProductModel({
      ...req.body,
      createdBy: id,
    });
    const savedProduct = await product.save();

    // Get user Data and add product to user's products
    const user = await userModel.findById(id);
    user.products.push(savedProduct.id);
    await user.save();

    res.status(200).json({
      message: 'Product added successfully',
      product: savedProduct,
    });
  } catch (error) {
    internalServerError(res, error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const { id } = req.user;

    const product = await ProductModel.findOneAndDelete({ _id: productId, createdBy: id });

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    res.status(202).json({
      message: 'Product deleted successfully',
    }); // 202 - Accepted
  } catch (error) {
    internalServerError(res, error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { productId, ...rest } = req.body;
    console.log('~ rest', rest);
    const { id } = req.user;

    const product = await ProductModel.findOneAndUpdate({ _id: productId, createdBy: id }, rest, { new: true });

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      });
    }

    res.status(202).json({
      message: 'Product updated successfully',
      product,
    }); // 202 - Accepted
  } catch (error) {
    internalServerError(res, error);
  }
};

const getAllProductsWithTheirOwnerInformations = async (req, res) => {
  try {
    const products = await ProductModel.find()
      .populate({
        path: 'createdBy',
        select: '-createdAt -updatedAt -__v -password -phone -emailConfirmed -products',
      })
      .select('-createdAt -updatedAt -__v -password');

    if (!products.length) {
      return res.status(404).json({
        message: 'Products not Found',
      });
    }

    res.status(200).json({
      message: 'Products Found',
      numberOfProducts: products.length,
      products,
    });
  } catch (error) {
    internalServerError(res, error);
  }
};

const getAllProductsCreatedYesterdayUsingMomentMethod = async (req, res) => {
  try {
    // TODO not sure of this solution

    /**
        When we get yesterday's date, there are three possibilities

        1. Get yesterday date with current timing
        moment().subtract(1, 'days').toString()

        2. Get yesterday date with start of the day
        moment().subtract(1, 'days').startOf('day').toString()

        3. Get yesterday date with end of the day
        moment().subtract(1, 'days').endOf('day').toString()
     */
    const yesterday = moment().subtract(1, 'days').endOf('day').toString();
    console.log('~ yesterday', yesterday);

    const products = await ProductModel.find({ date: { $lt: yesterday } });

    if (!products.length) {
      return res.status(404).json({
        message: 'Products not Found',
      });
    }

    res.status(200).json({
      message: 'Products Found',
      numberOfProducts: products.length,
      products,
    });
  } catch (error) {
    internalServerError(res, error);
  }
};

module.exports = {
  addProduct,
  deleteProduct,
  updateProduct,
  getAllProductsWithTheirOwnerInformations,
  getAllProductsCreatedYesterdayUsingMomentMethod,
};
