const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID!', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    // console.log(req.body);
    // console.log(req.body.image);

    if (req.body.description)
      req.body.description = req.body.description
        .split('. ')
        .map(x => (!x.endsWith('.') ? x + '.' : x))
        .slice(0, -1);

    if (req.body.learnSummary)
      req.body.learnSummary = req.body.learnSummary
        .split('. ')
        .map(x => (!x.endsWith('.') ? x + '.' : x))
        .slice(0, -1);

    if (req.body.requirements)
      req.body.requirements = req.body.requirements
        .split('. ')
        .map(x => (!x.endsWith('.') ? x + '.' : x))
        .slice(0, -1);

    if (req.body.langSound) req.body.langSound = req.body.langSound.split(', ');

    if (req.body.langSubs) req.body.langSubs = req.body.langSubs.split(', ');

    console.log(req.body);

    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // console.log(doc);

    if (!doc) {
      return next(new AppError('No document found with that ID!', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    // console.log(req.body);
    // console.log(req.body.description);
    if (req.body.description)
      req.body.description = req.body.description
        .split('. ')
        .map(x => (!x.endsWith('.') ? x + '.' : x))
        .slice(0, -1);

    if (req.body.learnSummary)
      req.body.learnSummary = req.body.learnSummary
        .split('. ')
        .map(x => (!x.endsWith('.') ? x + '.' : x))
        .slice(0, -1);

    if (req.body.requirements)
      req.body.requirements = req.body.requirements
        .split('. ')
        .map(x => (!x.endsWith('.') ? x + '.' : x))
        .slice(0, -1);

    if (req.body.langSound) req.body.langSound = req.body.langSound.split(', ');

    if (req.body.langSubs) req.body.langSubs = req.body.langSubs.split(', ');

    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID!', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on course
    let filter = {};
    if (req.params.courseId) filter = { course: req.params.courseId };

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;
    // const doc = await features.query.explain();
    // query.sort().select().skip().limit()

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
    });
  });
