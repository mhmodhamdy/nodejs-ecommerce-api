const Product = require('../models/productModel');

const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlersFactory');

// @desc    Get all products
exports.getProducts = getAll(Product, 'Products');
// @desc    Create a product
exports.getProduct = getOne(Product);
// @desc    Update a product by id
exports.createProduct = createOne(Product);
/* @desc    Delete one product from the database using its ID 
 and return it to user as JSON object with status code 204 */
exports.updateProduct = updateOne(Product);
// @desc   Delete one product from the database based on provided Id
exports.deleteProduct = deleteOne(Product);
