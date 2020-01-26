const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A course must have a title!'],
    unique: true,
    trim: true
  },
  subtitle: {
    type: String,
    required: [true, 'A course must have a subtitle!'],
    trim: true
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  },
  studentsEnrolled: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: true
  },
  lastUpdate: {
    type: Date,
    default: Date.now()
  },
  langSound: {
    type: [String],
    required: [true, 'A course must have a language for sound!']
  },
  langSubs: {
    type: [String],
    required: [true, 'A course must have a language for subs!']
  },
  image: {
    type: String,
    required: [true, 'A course must have a cover image!']
  },
  priceValue: {
    type: Number,
    required: [true, 'A course must have a price!']
  },
  priceDiscount: {
    type: Number
  },
  pricePercentage: {
    type: Number
  },
  includesVideos: {
    type: Number,
    required: [true, 'A course must have a includes video count!']
  },
  includesArticles: {
    type: Number,
    required: [true, 'A course must have a includes article count!']
  },
  includesContent: {
    type: Number,
    required: [true, 'A course must have a includes content count!']
  },
  learnSummary: {
    type: [String],
    required: [true, 'A course must have a learn summary!']
  },
  description: {
    type: [String],
    required: [true, 'A course must have a description!']
  },
  requirements: {
    type: [String],
    required: [true, 'A course must have requirements!']
  },
  teachers: {
    type: [String]
  },
  reviews: {
    type: [String]
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
