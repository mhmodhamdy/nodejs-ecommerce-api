const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const expressAsyncHandler = require('express-async-handler');

const Product = require('../models/productModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlersFactory');
const { uploadMixOfImages } = require('../middleware/uploadImageMiddleware');

exports.uploadProductImages = uploadMixOfImages([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 8 },
]);

exports.resizeProductImage = expressAsyncHandler(async (req, res, next) => {
  //image processing for image cover
  if (req.files.imageCover) {
    const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 80 })
      .toFile(`uploads/products/${imageCoverFileName}`);

    // Save images in database
    req.body.imageCover = imageCoverFileName;
  }
  //image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-productImages.jpeg`;
        await sharp(img.buffer)
          .resize(800, 600)
          .toFormat('jpeg')
          .jpeg({ quality: 80 })
          .toFile(`uploads/products/${imageName}`);

        // Save images in database
        req.body.images.push(imageName);
      })
    );
  }
  next();
});

// @desc    Get all products
exports.getProducts = getAll(Product, 'Products');
// @desc    Create a product
exports.getProduct = getOne(Product, 'reviews');
// @desc    Update a product by id
exports.createProduct = createOne(Product);
/* @desc    Delete one product from the database using its ID 
 and return it to user as JSON object with status code 204 */
exports.updateProduct = updateOne(Product);
// @desc   Delete one product from the database based on provided Id
exports.deleteProduct = deleteOne(Product);
