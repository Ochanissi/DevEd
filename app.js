const express = require('express');
const morgan = require('morgan');

const courseRouter = require('./routes/courseRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware!');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/api/v1/courses', getAllCourses);
// app.get('/api/v1/courses/:id', getCourse);
// app.post('/api/v1/courses', createCourse);
// app.patch('/api/v1/courses/:id', updateCourse);
// app.delete('/api/v1/courses/:id', deleteCourse);

// ROUTES

app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/users', userRouter);

// START SERVER

module.exports = app;
