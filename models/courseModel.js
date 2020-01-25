const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A course must have a name!'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A course must have a price!']
  }
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
