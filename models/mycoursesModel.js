const mongoose = require('mongoose');

const mycoursesSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: [true, 'MyCourses must belong to a Course!']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'MyCourses must belong to a User!']
  },
  price: {
    type: Number,
    required: [true, 'MyCourses must have a price!']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  }
});

mycoursesSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'course',
    select: 'title'
  });

  next();
});

const MyCourses = mongoose.model('MyCourses', mycoursesSchema);

module.exports = MyCourses;
