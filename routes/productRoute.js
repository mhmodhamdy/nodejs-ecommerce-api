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

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(
    authorization,
    allowedTo('maneger', 'admin'),
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
    allowedTo('maneger', 'admin'),
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
