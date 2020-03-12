const Course = require('../models/courseModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const MyCourses = require('../models/mycoursesModel');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;
  if (alert === 'my-courses') {
    res.locals.alert =
      'Your purchase was successful! Please check your email for confirmation!';
  }
  next();
};

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

exports.getCourse = catchAsync(async (req, res, next) => {
  // 1. Get the data for the requested course (including reviews and guides)
  const course = await Course.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });
  if (!course) {
    return next(new AppError('There is no course with that name!', 404));
  }

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

exports.getSignupForm = catchAsync(async (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up to DevEd'
  });
});

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.getMyCourses = catchAsync(async (req, res, next) => {
  // 1. Find all bought courses
  const mycourses = await MyCourses.find({ user: req.user.id });

  // 2. Find courses with the returned IDs
  const courseIDs = mycourses.map(el => el.course);
  const courses = await Course.find({ _id: { $in: courseIDs } });

  res.status(200).render('mycourses', {
    title: 'My Courses',
    courses
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  // console.log('UPDATING USER ' + req.body);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser
  });
});
