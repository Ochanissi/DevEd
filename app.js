const fs = require('fs');
const express = require('express');

const app = express();

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

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
