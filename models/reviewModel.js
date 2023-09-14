const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be greater than 0'],
      max: [5, "Rating can't exceed more then five"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to user'],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: ['true', 'Review must belong to product'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
