const multer = require('multer');
const sharp = require('sharp');
const slugify = require('slugify');
const Course = require('./../models/courseModel');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images!', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadCoursePhoto = upload.single('image');

exports.resizeCoursePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  // console.log(req.file);
  // console.log(req.file.originalname);

  req.body.image = `course-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(340, 180)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/courses/${req.body.image}`);

  next();
});

exports.aliasTopCourses = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

exports.getAllCourses = factory.getAll(Course);

// exports.getAllCourses = catchAsync(async (req, res, next) => {
//   // EXECUTE QUERY
//   const features = new APIFeatures(Course.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const courses = await features.query;
//   // query.sort().select().skip().limit()

//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     results: courses.length,
//     data: {
//       courses
//     }
//   });
// });

exports.getCourse = factory.getOne(Course, { path: 'reviews' });

// exports.getCourse = catchAsync(async (req, res, next) => {
//   // console.log(req.params);
//   const course = await Course.findById(req.params.id).populate('reviews');
//   // Couse.findOne({ _id: req.params.id })

//   if (!course) {
//     return next(new AppError('No course found with that ID!', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       course
//     }
//   });
// });

exports.createCourse = factory.createOne(Course);

// exports.createCourse = catchAsync(async (req, res, next) => {
//   const newCourse = await Course.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       course: newCourse
//     }
//   });
// });

exports.updateCourse = factory.updateOne(Course);

// exports.updateCourse = catchAsync(async (req, res, next) => {
//   const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true
//   });

//   if (!course) {
//     return next(new AppError('No course found with that ID!', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       course
//     }
//   });
// });

exports.deleteCourse = factory.deleteOne(Course);

// exports.deleteCourse = catchAsync(async (req, res, next) => {
//   const course = await Course.findByIdAndDelete(req.params.id);

//   if (!course) {
//     return next(new AppError('No course found with that ID!', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null
//   });
// });

exports.getCourseStats = catchAsync(async (req, res, next) => {
  const stats = await Course.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        // _id: '$langSound',
        _id: '$ratingsAverage',
        numRatings: { $sum: '$ratingsQuantity' },
        numCourses: { $sum: 1 },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$priceValue' },
        minPrice: { $min: '$priceValue' },
        maxPrice: { $max: '$priceValue' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY'}}
    // }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; //2021

  const plan = await Course.aggregate([
    {
      $unwind: '$createdAt'
    },
    {
      $match: {
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        numCourseStarts: { $sum: 1 },
        courses: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numCourseStarts: -1 }
    },
    {
      $limit: 12
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});
