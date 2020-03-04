const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('../controllers/authController');
const mycoursesController = require('../controllers/mycoursesController');

const router = express.Router({ mergeParams: true });

// router.use(authController.isLoggedIn);

router.get(
  '/',
  mycoursesController.createBuyCheckout,
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
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-courses', authController.protect, viewsController.getMyCourses);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
