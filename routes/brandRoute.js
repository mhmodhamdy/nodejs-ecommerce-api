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
const { auth, allowedTo } = require('../services/authService');

const router = express.Router();

router
  .route('/')
  .get(getBrands)
  .post(
    auth,
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
    auth,
    allowedTo('maneger', 'admin'),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(auth, allowedTo('admin'), deleteBrandValidator, deleteBrand);

module.exports = router;
