const Course = require('./../models/courseModel');

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'failed',
      message: 'Missing name or price.'
    });
  }

  next();
};

exports.getAllCourses = (req, res) => {
  // console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime
    // results: courses.length,
    // data: {
    //   courses
    // }
  });
};

exports.getCourse = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  // const course = courses.find(el => el.id === id);

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     course
  //   }
  // });
};

exports.createCourse = (req, res) => {
  res.status(201).json({
    status: 'success'
    // data: {
    //   course: newCourse
    // }
  });
};

exports.updateCourse = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      course: '<Updated course here...>'
    }
  });
};

exports.deleteCourse = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};
