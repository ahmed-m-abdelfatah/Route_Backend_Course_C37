const {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProductsWithUsersAndComments,
  getAllProductsWithPriceBetween,
} = require('./product_controller.js');

const productRouter = require('express').Router();

productRouter.post('/products/add', addProduct);
productRouter.patch('/products/update', updateProduct);
productRouter.delete('/products/delete', deleteProduct);
productRouter.get('/products/all', getAllProductsWithUsersAndComments);
productRouter.get('/products/all', getAllProductsWithPriceBetween);

module.exports = productRouter;
