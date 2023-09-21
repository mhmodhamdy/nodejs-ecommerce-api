const mongoose = require('mongoose');
const Product = require('./productModel');

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be greater than 0'],
      max: [5, "Rating can't exceed more then five"],
      required: [true, 'Review rating required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
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

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name' });
  next();
});
reviewSchema.pre(/^create/, function (next) {
  this.populate({ path: 'user', select: 'name' });
  next();
});

reviewSchema.statics.calcAvaregeRatingAndQuantity = async function (productId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: 'product',
        avgRatings: { $avg: '$rating' },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingAvarege: result[0].avgRatings,
      ratingQuantity: result[0].ratingQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingAvarege: 0,
      ratingQuantity: 0,
    });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calcAvaregeRatingAndQuantity(this.product);
});
reviewSchema.post(
  'deleteOne',
  { query: true, document: true },
  async function () {
    await this.constructor.calcAvaregeRatingAndQuantity(this.product);
  }
);

module.exports = mongoose.model('Review', reviewSchema);
