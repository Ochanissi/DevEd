const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A course must have a name!'],
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'A course must have a duration!']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A course must have a group size!']
  },
  difficulty: {
    type: String,
    required: [true, 'A course must have a difficulty!']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A course must have a price!']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A course must have a description!']
  },
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A course must have a cover image!']
  },
  images: [String],
  createAt: {
    type: Date,
    default: Date.now()
  },
  startDates: [Date]
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
