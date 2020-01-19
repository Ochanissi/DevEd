const fs = require('fs');

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/courses-simple.json`)
);

exports.getAllCourses = (req, res) => {
  // console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: courses.length,
    data: {
      courses
    }
  });
};

exports.getCourse = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  const course = courses.find(el => el.id === id);

  // if (id > courses.length) {
  if (!course) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      course
    }
  });
};

exports.createCourse = (req, res) => {
  // console.log(req.body);

  const newId = courses[courses.length - 1].id + 1;
  const newCourse = Object.assign({ id: newId }, req.body);

  courses.push(newCourse);

  fs.writeFile(
    `${__dirname}/dev-data/data/courses-simple.json`,
    JSON.stringify(courses),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          course: newCourse
        }
      });
    }
  );

  // res.send('Done');
};

exports.updateCourse = (req, res) => {
  if (req.params.id * 1 > courses.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID'
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      course: '<Updated course here...>'
    }
  });
};

exports.deleteCourse = (req, res) => {
  if (req.params.id * 1 > courses.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID'
    });
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
};
