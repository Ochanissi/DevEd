const Course = require('./../models/courseModel');

exports.getAllCourses = async (req, res) => {
  try {
    // BUI LD QUERY
    // 1A. Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    // console.log(req.query, queryObj);

    // 1B. Advanced filtering

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    // console.log(JSON.parse(queryStr));

    // { price: {  $gte: 5 } }
    // gte, gt, lte, lt

    let query = Course.find(JSON.parse(queryStr));

    // 2. Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      // console.log(sortBy);
      query.sort(sortBy);
      // sort('price ratingsAverage')
      // ?sort=-price,ratingsAverage
    } else {
      query.sort('-createdAt');
    }

    // 3. Field Limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4. Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // ?page=2&limit=10, 1-10, page 1, 11-20, page 2. 21-30, page 3
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numCourses = await Course.countDocuments();
      if (skip >= numCourses) throw Error('This page does not exist!');
    }

    // const query = Course.find({
    //   price: 10,
    //   studentsEnrolled: 20
    // });

    // const query = Course.find()
    //   .where('price')
    //   .equals(5)
    //   .where('studentsEnrolled')
    //   .equals(20);

    // EXECUTE QUERY
    const courses = await query;
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
