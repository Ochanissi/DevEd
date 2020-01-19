const express = require('express');
const courseController = require('./../controllers/courseController');

const router = express.Router();

router.param('id', courseController.checkID);

router
  .route('/')
  .get(courseController.getAllCourses)
  .post(courseController.checkBody, courseController.createCourse);

router
  .route('/:id')
  .get(courseController.getCourse)
  .patch(courseController.updateCourse)
  .delete(courseController.deleteCourse);

module.exports = router;
