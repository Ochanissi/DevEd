const Course = require('../models/courseModel');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const MyCourses = require('../models/mycoursesModel');
const APIFeatures = require('./../utils/apiFeatures');
const Review = require('./../models/reviewModel');

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

// exports.getAllCourses = catchAsync(async (req, res, next) => {
//   // 1. Get course data from collection
//   const courses = await Course.find();

//   // 2. Build template

//   // 3. Render that template using course data from 1.

//   res.status(200).render('courses', {
//     title: 'All Courses',
//     courses
//   });
// });

exports.getAllCourses = catchAsync(async (req, res, next) => {
  // Get unfiltered courses
  const unfilteredCourses = await Course.find();

  let filter = {};

  if (req.params.courseId) filter = { course: req.params.courseId };

  // EXECUTE QUERY
  // 1. Get course data from collection
  const features = new APIFeatures(Course.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const courses = await features.query;

  // 2. Build template

  // 3. Render that template using course data from 1.

  res.status(200).render('courses', {
    title: 'All Courses',
    courses,
    unfilteredCourses
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
    title: 'Your Account'
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

exports.getMyReviews = catchAsync(async (req, res, next) => {
  // const user = await User.findById(req.user.id);
  const reviews = await Review.find({ user: req.user.id });

  // console.log(user);
  // console.log(reviews);

  res.status(200).render('myreviews', {
    title: 'My Reviews',
    reviews
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
    title: 'Your Account',
    user: updatedUser
  });
});

exports.createCourse = catchAsync(async (req, res, next) => {
  // const user = await User.findById(req.user.id);
  // console.log(user);
  // console.log('lek');
  // const courses = await Course.find();
  res.status(200).render('createcourse', {
    title: 'Create New Course'
  });
});

exports.manageCourses = catchAsync(async (req, res, next) => {
  const courses = await Course.find();
  res.status(200).render('managecourses', {
    title: 'Manage Courses',
    courses
  });
});

exports.manageUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).render('manageusers', {
    title: 'Manage Users',
    users
  });
});

exports.manageReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  // console.log(reviews);

  res.status(200).render('managereviews', {
    title: 'Manage Reviews',
    reviews
  });
});

exports.updateCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  // const updatedCourse = await Course.findByIdAndUpdate(req.params.id, {
  //   new: true,
  //   runValidators: true
  // });

  // console.log(course);

  // console.log(req.user);
  // console.log(req.course);
  // console.log(req.params.id);
  // console.log(course);

  res.status(200).render('updatecourse', {
    title: 'Update Course',
    course
  });
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  // const updatedCourse = await Course.findByIdAndUpdate(req.params.id, {
  //   new: true,
  //   runValidators: true
  // });

  // console.log(review);

  // console.log(req.user);
  // console.log(req.course);
  // console.log(req.params.id);
  // console.log(course);

  res.status(200).render('updatereview', {
    title: 'Update Review',
    review
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  // const updatedCourse = await Course.findByIdAndUpdate(req.params.id, {
  //   new: true,
  //   runValidators: true
  // });

  // console.log(user);

  // console.log(req.user);
  // console.log(req.course);
  // console.log(req.params.id);
  // console.log(course);

  res.status(200).render('updateuser', {
    title: 'Update User',
    user
  });
});
