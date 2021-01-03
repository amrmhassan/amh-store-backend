import catchAsync from './catchAsync.js';
import AppError from '../utils/AppError.js';

const appError = new AppError();

export const getOne = (Model, populate = []) =>
  catchAsync(async (req, res, next) => {
    // 1] getting doc id
    const id = req.params.id;
    let query = Model.findById(id);

    populate.length > 0
      ? populate.forEach(
          (pop) =>
            (query = query.populate({
              path: pop.path,
              select: pop.select,
            }))
        )
      : null;

    const doc = await query;
    if (!doc) {
      return next(appError.addError(`no document with ${id} id`, 404));
    }
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const count = await Model.countDocuments({ ...keyword });
    const docs = await Model.find({ ...keyword })
      //! sorting create a problem with limiting and skipping
      //! try to troubleshoot this problem
      // .sort('role createdAt')
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    if (docs.length >= 1) {
      return res.status(200).json({
        status: 'success',
        result: docs.length,
        page,
        pages: Math.ceil(count / pageSize),
        data: docs,
      });
    }

    res.status(200).json({
      status: 'success',
      data: 'No data to show!',
    });
  });

export const createOne = (Model, data = []) =>
  //? "data" is what we are interested in from what user sends
  catchAsync(async (req, res, next) => {
    const dataToSave = {};
    data.forEach((key) => {
      dataToSave[key] = req.body[key];
    });

    const newDoc = await Model.create(dataToSave);
    res.status(200).json({
      status: 'success',
      data: newDoc,
    });
  });

export const updateOne = (Model, data = []) =>
  catchAsync(async (req, res, next) => {
    const dataToUpdate = {};
    data.forEach((key) => {
      if (req.body[key]) dataToUpdate[key] = req.body[key];
    });
    const id = req.params.id;

    const doc = await Model.findByIdAndUpdate(id, dataToUpdate, {
      new: true,
      useFindAndModify: false,
      runValidators: true,
    });

    if (!doc) {
      return next(appError.addError('no data found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const deletedDoc = await Model.findByIdAndDelete(id);
    if (!deletedDoc) {
      return next(appError.addError('no data found', 404));
    }
    res.status(200).json({
      status: 'success',
      data: deletedDoc,
    });
  });
