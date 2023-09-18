const asyncHandler = require('express-async-handler');

const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');

exports.getOne = (Model, populateOpt) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // Build query
    let query = Model.findById(id);
    if (populateOpt) {
      query = query.populate(populateOpt);
    }
    const doucument = await query;
    if (!doucument) {
      return next(new ApiError('No doucument Found', 404));
    }
    res.status(200).json({ data: doucument });
  });

exports.getAll = (Model, modelName = '') =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    const doucumentCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .limitFields()
      .paginate(doucumentCount)
      .search(modelName)
      .sort();

    //excute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const doucuments = await mongooseQuery;
    res.json({
      results: doucuments.length,
      paginationResult,
      data: doucuments,
    });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDoucument = await Model.create(req.body);
    res.status(201).json({ stutes: 'succes', data: newDoucument });
  });

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const doucument = await Model.findOneAndDelete({ _id: id });
    if (!doucument) {
      return next(new ApiError('No doucument Found', 404));
    }
    // Trigger remove event when update doucument
    doucument.deleteOne();
    res.json({
      stutes: 'succes',
      msg: 'Deleted',
    });
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const doucument = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!doucument) {
      return next(new ApiError('No doucument Found', 404));
    }
    // Trigger save event when update doucument
    doucument.save();
    res.json({ stutes: 'succes', data: doucument });
  });
