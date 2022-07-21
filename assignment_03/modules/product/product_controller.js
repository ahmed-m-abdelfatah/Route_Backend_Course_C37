const { Op } = require('sequelize');
const { productModel, userModel, commentModel } = require('../../DB/models.js');

const addProduct = (req, res) => {
  productModel
    .create(req.body)
    .then(() => {
      res.status(200).json({
        message: 'Product added successfully',
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message,
      });
    });
};

const updateProduct = (req, res) => {
  const { id, userId, ...rest } = req.body;
  console.log('~ rest', rest);

  productModel
    .findOne({
      where: {
        id,
        userId,
      },
    })
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found this user',
        });
      }

      // Update product
      product
        .update({ ...rest })
        .then(product => {
          res.status(200).json({
            message: 'Product updated successfully',
            product,
          });
        })
        .catch(err => {
          res.status(500).json({
            message: err.message,
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message,
      });
    });
};

const deleteProduct = (req, res) => {
  const { id, userId } = req.body;

  productModel
    .findOne({
      where: {
        id,
        userId,
      },
    })
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found for this user',
        });
      }

      // Update product
      product
        .destroy()
        .then(result => {
          console.log('~ result', result);
          res.status(200).json({
            message: 'Product deleted successfully',
          });
        })
        .catch(err => {
          res.status(500).json({
            message: err.message,
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message,
      });
    });
};

// TODO
const getAllProductsWithUsersAndComments = (req, res) => {
  productModel
    .findAll({
      include: [
        {
          model: userModel,
          attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
        },
        {
          model: commentModel,
        },
      ],
    })
    .then(products => {
      res.status(200).json({
        message: 'Products fetched successfully',
        products,
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message,
      });
    });
};

// TODO
const getAllProductsWithPriceBetween = (req, res) => {
  console.log('~ getAllProductsWithPriceBetween');
  const { min, max } = req.query;
  console.log('~ max', max);
  console.log('~ min', min);

  productModel
    .findAll({
      where: {
        price: {
          [Op.between]: [min, max],
        },
      },
    })
    .then(products => {
      res.status(200).json({
        message: 'Products fetched successfully',
        products,
      });
    })
    .catch(err => {
      res.status(500).json({
        message: err.message,
      });
    });
};

module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProductsWithUsersAndComments,
  getAllProductsWithPriceBetween,
};
