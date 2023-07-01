const express = require('express');
const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} = require('../services/brandService');
const {
  getBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
  createBrandValidator,
} = require('../utils/validators/brandValidator');

const router = express.Router();

router.route('/').get(getBrands).post(createBrandValidator, createBrand);

router
  .route('/:id')
  .get(getBrandValidator, getBrand)
  .put(updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;