const Course = require('../models/courseModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'Online Courses'
  });
};

exports.getAllCourses = catchAsync(async (req, res, next) => {
  // 1. Get course data from collection
  const courses = await Course.find();

  // 2. Build template

  // 3. Render that template using course data from 1.

  res.status(200).render('courses', {
    title: 'All Courses',
    courses
  });
});

exports.getCourse = (req, res) => {
  res.status(200).render('course', {
    title: 'The Complete JS Developer'
  });
};
