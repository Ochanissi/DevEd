const express = require('express');
const mycoursesController = require('../controllers/mycoursesController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.get(
  '/checkout-session/:courseId',
  mycoursesController.getCheckoutSession
);

router.use(authController.restrictTo('admin', 'teacher'));

router
  .route('/')
  .get(mycoursesController.getAllMyCourse)
  .post(mycoursesController.createMyCourse);

router
  .route('/:id')
  .get(mycoursesController.getMyCourse)
  .patch(mycoursesController.updateMyCourse)
  .delete(mycoursesController.deleteMyCourse);

module.exports = router;
