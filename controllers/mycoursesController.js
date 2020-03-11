const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Course = require('../models/courseModel');
const User = require('../models/userModel');
const MyCourses = require('../models/mycoursesModel');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. Get the currently bought course
  const course = await Course.findById(req.params.courseId);

  // 2, Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    // success_url: `${req.protocol}://${req.get('host')}/my-courses/?course=${
    //   req.params.courseId
    // }&user=${req.user.id}&price=${(
    //   course.priceValue -
    //   (course.priceValue * course.priceDiscount) / 100
    // ).toFixed(2)}`,
    success_url: `${req.protocol}://${req.get('host')}/my-courses`,
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

// exports.createBuyCheckout = catchAsync(async (req, res, next) => {
//   // This is only TEMPORARY, because it's UNSECURE: everyone can get access to courses without paying.

//   const { course, user, price } = req.query;

//   // console.log(req.query);
//   // console.log(user);

//   if (!course && !user && !price) return next();

//   await MyCourses.create({ course, user, price });

//   res.redirect(req.originalUrl.split('?')[0]);
// });

const createBuyCheckout = async session => {
  const course = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.line_items[0].amount / 100;
  await MyCourses.create({ course, user, price });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.complete') {
    createBuyCheckout(event.data.object);
  }

  res.status(200).json({ received: true });
};

exports.createMyCourse = factory.createOne(MyCourses);
exports.getMyCourse = factory.getOne(MyCourses);
exports.getAllMyCourse = factory.getAll(MyCourses);
exports.updateMyCourse = factory.updateOne(MyCourses);
exports.deleteMyCourse = factory.deleteOne(MyCourses);
