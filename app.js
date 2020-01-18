const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side!', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint...');
// });

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/courses-simple.json`)
);

app.get('/api/v1/courses', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: courses.length,
    data: {
      courses
    }
  });
});

app.get('/api/v1/courses/:id', (req, res) => {
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
});

app.post('/api/v1/courses', (req, res) => {
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
});

app.patch('/api/v1/courses/:id', (req, res) => {
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
});

app.delete('/api/v1/courses/:id', (req, res) => {
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
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
