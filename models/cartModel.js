const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: String,
        price: Number,
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

cartSchema.pre(/^find/, function (next) {
  this.populate({ path: 'cartItems.product', select: 'title' });
  next();
});
cartSchema.pre(/^create/, function (next) {
  this.populate({ path: 'cartItems.product', select: 'title' });
  next();
});
cartSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name' });
  next();
});
cartSchema.pre(/^create/, function (next) {
  this.populate({ path: 'user', select: 'name' });
  next();
});

module.exports = mongoose.model('Cart', cartSchema);
