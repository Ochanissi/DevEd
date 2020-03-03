const express = require('express');
const mycoursesController = require('../controllers/mycoursesController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get(
  '/checkout-session/:courseId',
  authController.protect,
  mycoursesController.getCheckoutSession
);

module.exports = router;
