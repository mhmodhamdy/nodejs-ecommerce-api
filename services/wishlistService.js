const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');

// @desc    Add product to wishlist
exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: 'Success',
    message: 'Product added successfully',
    data: user.wishlist,
  });
});

// @desc    Remove product from wishlist
exports.removeFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );
  res.status(200).json({
    status: 'Success',
    message: 'Product removed successfully',
    data: user.wishlist,
  });
});

// @desc    Get Logged User wishlist
exports.getWishListItems = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  if (!user.wishlist[0]) {
    res.status(200).json({
      status: 'Success',
      result: user.wishlist.length,
      data: { message: 'No products in your wishlist' },
    });
  }
  res.status(200).json({
    status: 'Success',
    result: user.wishlist.length,
    data: user.wishlist,
  });
});
