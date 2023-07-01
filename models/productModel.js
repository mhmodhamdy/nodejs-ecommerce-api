const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [128, 'Too long product title'],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, 'Too short product description'],
      maxlength: [1024, 'Too long product description'],
    },
    quantity: {
      type: Number,
      required: [true, 'Product quantity is requierd'],
      min: 0,
      max: 1000,
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Product price is requierd'],
      trim: true,
      maxlength: [16, 'Too long Product price'],
    },
    priceAfterDiscount: {
      type: Number,
      optional: true,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, 'Product ImageCover required'],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
      required: [true, 'product must be belong to category'],
    },
    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Subcategory',
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: 'Brand',
    },
    ratingAvarege: {
      type: Number,
      min: [1, 'Rating must be more than or equal 1'],
      max: [5, 'Rating must be less than or equa 5'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
