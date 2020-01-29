const Course = require('./../models/courseModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopCourses = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

exports.getAllCourses = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Course.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const courses = await features.query;
    // query.sort().select().skip().limit()

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: courses.length,
      data: {
        courses
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    // console.log(req.params);
    const course = await Course.findById(req.params.id);
    // Couse.findOne({ _id: req.params.id })

    res.status(200).json({
      status: 'success',
      data: {
        course
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err
    });
  }
};

exports.createCourse = async (req, res) => {
  try {
    // const newCourse = new Course({});
    // newCourse.save();

    const newCourse = await Course.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        course: newCourse
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        course
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err
    });
  }
};

exports.getCourseStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err
    });
  }
};
