const express = require('express');
const viewsController = require('./../controllers/viewsController');

const router = express.Router();

router.get('/', viewsController.getOverview);

router.get('/courses', viewsController.getAllCourses);

router.get('/course/:slug', viewsController.getCourse);

module.exports = router;
