const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doucument = await Model.findOneAndDelete({ _id: id });
    if (!doucument) {
      return next(new ApiError('No Brand Found', 404));
    }
    res.json({
      stutes: 'succes',
      msg: 'Brand Deleted',
    });
  });
