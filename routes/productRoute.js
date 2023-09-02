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

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(
    uploadProductImages,
    resizeProductImage,
    createProductValidator,
    createProduct
  );

router
  .route('/:id')
  .get(getProductValidator, getProduct)
  .put(
    uploadProductImages,
    resizeProductImage,
    updateProductValidator,
    updateProduct
  )
  .delete(deleteProductValidator, deleteProduct);

module.exports = router;
