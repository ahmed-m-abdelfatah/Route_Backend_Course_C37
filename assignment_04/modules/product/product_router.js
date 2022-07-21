const auth = require('../../auth/auth.js');
const {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProductsWithTheirOwnerInformations,
  getAllProductsForSepcificUser,
} = require('./product_controller.js');

const productRouter = require('express').Router();

productRouter.post('/addProduct', auth(), addProduct);
productRouter.patch('/updateProduct', auth(), updateProduct);
productRouter.delete('/deleteProduct', auth(), deleteProduct);
productRouter.get('/getAllProductsWithTheirOwnerInformations', getAllProductsWithTheirOwnerInformations);
productRouter.get('/getAllProductsForSepcificUser', getAllProductsForSepcificUser);

module.exports = productRouter;
