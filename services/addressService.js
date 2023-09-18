const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');

// @desc    Add Address
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { address: req.body },
    },
    { new: true }
  );
  res.status(200).json({
    status: 'Success',
    message: 'Address added successfully',
    data: user.address,
  });
});

// @desc    Remove address
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { address: { _id: req.params.addressId } },
    },
    { new: true }
  );
  if (!user.address.addressId) {
    return res
      .status(401)
      .json({ message: 'There is no address found for this id' });
  }
  res.status(200).json({
    status: 'Success',
    message: 'Address removed successfully',
    data: user.address,
  });
});

// @desc    Get Logged User addresses
exports.getMyAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('address');
  if (!user.address[0]) {
    res.status(200).json({
      status: 'Success',
      result: user.address.length,
      data: { message: 'No addresses added' },
    });
  }
  res.status(200).json({
    status: 'Success',
    result: user.address.length,
    data: user.address,
  });
});
