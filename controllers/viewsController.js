exports.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'Online Courses'
  });
};

exports.getAllCourses = (req, res) => {
  res.status(200).render('overview', {
    title: 'All Courses'
  });
};

exports.getCourse = (req, res) => {
  res.status(200).render('course', {
    title: 'The Complete JS Developer'
  });
};
