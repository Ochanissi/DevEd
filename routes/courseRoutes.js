const express = require('express');
const courseController = require('./../controllers/courseController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// router.param('id', courseController.checkID);

// router
//   .route('/:courseId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

router.use('/:courseId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(courseController.aliasTopCourses, courseController.getAllCourses);

router.route('/course-stats').get(courseController.getCourseStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    courseController.getMonthlyPlan
  );

router
  .route('/')
  .get(courseController.getAllCourses)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    courseController.uploadCoursePhoto,
    courseController.resizeCoursePhoto,
    courseController.createCourse
  );

router
  .route('/:id')
  .get(courseController.getCourse)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    courseController.uploadCoursePhoto,
    courseController.resizeCoursePhoto,
    courseController.updateCourse
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    courseController.deleteCourse
  );

module.exports = router;
