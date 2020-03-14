const mongoose = require('mongoose');
const Course = require('./courseModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: 'Course',
      required: [true, 'Review must belong to a course!']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user!']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index(
  { course: 1, user: 1 },
  {
    unique: true
  }
);

reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'course',
  //   select: 'name'
  // }).populate({
  //   path: 'user',
  //   select: 'name photo'
  // });

  this.populate({
    path: 'user',
    select: 'name photo country occupation'
  });

  this.populate({
    path: 'course',
    select: 'title -teachers'
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function(courseId) {
  const stats = await this.aggregate([
    {
      $match: { course: courseId }
    },
    {
      $group: {
        _id: '$course',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Course.findByIdAndUpdate(courseId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Course.findByIdAndUpdate(courseId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

reviewSchema.post('save', function() {
  // this points to current review

  this.constructor.calcAverageRatings(this.course);
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne();
  // console.log(this.r);

  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  // await this.findOne(); dont NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.course);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
