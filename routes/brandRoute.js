const express = require('express');
const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require('../services/brandService');
const {
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
  createBrandValidator,
} = require('../utils/validators/brandValidator');
const { authorization, allowedTo } = require('../services/authService');

const router = express.Router();

router
  .route('/')
  .get(getBrands)
  .post(
    authorization,
    allowedTo('maneger', 'admin'),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  );

router
  .route('/:id')
  .get(getBrandValidator, getBrand)
  .put(
    authorization,
    allowedTo('maneger', 'admin'),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(authorization, allowedTo('admin'), deleteBrandValidator, deleteBrand);

module.exports = router;
