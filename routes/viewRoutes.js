const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('../controllers/authController');
const mycoursesController = require('../controllers/mycoursesController');

const router = express.Router({ mergeParams: true });

// router.use(authController.isLoggedIn);

router.use(viewsController.alerts);

router.get(
  '/',
  // mycoursesController.createBuyCheckout,
  authController.isLoggedIn,
  viewsController.getOverview
);
router.get(
  '/courses',
  authController.isLoggedIn,
  viewsController.getAllCourses
);
router.get(
  '/course/:slug',
  authController.isLoggedIn,
  viewsController.getCourse
);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-courses', authController.protect, viewsController.getMyCourses);
router.get('/my-reviews', authController.protect, viewsController.getMyReviews);

router.get(
  '/create-course',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.createCourse
);

router.get(
  '/manage-courses',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.manageCourses
);

router.get(
  '/manage-users',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.manageUsers
);

router.get(
  '/manage-reviews',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.manageReviews
);

router.get(
  '/manage-courses/update-course/:id',
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.updateCourse
);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
