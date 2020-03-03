const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Course = require('./../models/courseModel');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. Get the currently bought course
  const course = await Course.findById(req.params.courseId);

  // 2, Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/course/${course.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.courseId,
    line_items: [
      {
        name: `"${course.title}" Course`,
        description: course.subtitle,
        images: [
          `https://d22ir9aoo7cbf6.cloudfront.net/wp-content/uploads/sites/2/2018/07/online-courses-in-singapore.png`
        ],
        amount: Math.round(
          (
            course.priceValue -
            (course.priceValue * course.priceDiscount) / 100
          ).toFixed(2) * 100
        ),
        currency: 'usd',
        quantity: 1
      }
    ]
  });

  // 3, Create session as response
  res.status(200).json({
    status: 'success',
    session
  });
});
