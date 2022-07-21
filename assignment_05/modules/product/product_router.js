const auth = require('../../middleware/auth.js');
const validation = require('../../middleware/validation.js');
const { addProductValidationSchema, updateProductValidationSchema } = require('./product_validation_schema.js');
const {
  addProduct,
  deleteProduct,
  updateProduct,
  getAllProductsWithTheirOwnerInformations,
  getAllProductsCreatedYesterdayUsingMomentMethod,
} = require('./product_controller.js');

const productRouter = require('express').Router();

productRouter.post('/addProduct', validation(addProductValidationSchema), auth(), addProduct);
productRouter.delete('/deleteProduct', auth(), deleteProduct);
productRouter.patch('/updateProduct', validation(updateProductValidationSchema), auth(), updateProduct);
productRouter.get('/getAllProductsWithTheirOwnerInformations', getAllProductsWithTheirOwnerInformations);
productRouter.get('/getAllProductsCreatedYesterday', getAllProductsCreatedYesterdayUsingMomentMethod);

module.exports = productRouter;
