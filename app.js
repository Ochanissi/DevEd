const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

// MIDDLEWARES

app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/courses-simple.json`)
);

// ROUTE HANDLERS

const getAllCourses = (req, res) => {
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

const getCourse = (req, res) => {
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

const createCourse = (req, res) => {
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

const updateCourse = (req, res) => {
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

const deleteCourse = (req, res) => {
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

// app.get('/api/v1/courses', getAllCourses);
// app.get('/api/v1/courses/:id', getCourse);
// app.post('/api/v1/courses', createCourse);
// app.patch('/api/v1/courses/:id', updateCourse);
// app.delete('/api/v1/courses/:id', deleteCourse);

// ROUTES

app
  .route('/api/v1/courses')
  .get(getAllCourses)
  .post(createCourse);

app
  .route('/api/v1/courses/:id')
  .get(getCourse)
  .patch(updateCourse)
  .delete(deleteCourse);

// START SERVER

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
