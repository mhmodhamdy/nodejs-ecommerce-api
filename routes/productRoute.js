const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImage,
} = require('../services/productService');
const {
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
  createProductValidator,
} = require('../utils/validators/productValidator');
const { authorization, allowedTo } = require('../services/authService');
const reviewsRoute = require('./reviewRoute');

const router = express.Router();

router.use('/:productId/reviews', reviewsRoute);

router
  .route('/')
  .get(getProducts)
  .post(
    authorization,
    allowedTo('manager', 'admin'),
    uploadProductImages,
    resizeProductImage,
    createProductValidator,
    createProduct
  );

router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(
    authorization,
    allowedTo('manager', 'admin'),
    uploadProductImages,
    resizeProductImage,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authorization,
    allowedTo('admin'),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
