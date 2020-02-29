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

exports.getCourse = catchAsync(async (req, res) => {
  // 1. Get the data for the requested course (including reviews and guides)
  const course = await Course.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  // 2. Build template

  // 3. Render template using the data from 1.

  res.status(200).render('course', {
    title: course.title,
    course
  });
});

exports.getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
});
