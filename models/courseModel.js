const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A course must have a title!'],
      unique: true,
      trim: true,
      maxlength: [
        50,
        'A course title must have less or equal than 40 characters!'
      ],
      minlength: [
        10,
        'A course title must have less or equal than 40 characters!'
      ]
      // validate: [validator.isAlpha, 'Course title must only contain characters']
    },
    subtitle: {
      type: String,
      required: [true, 'A course must have a subtitle!'],
      trim: true
    },
    slug: String,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0!'],
      max: [5, 'Rating must be above 5.0!']
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
      type: Number,
      validate: {
        validator: function(val) {
          // this only points to current doc on NEW document creation
          return val < this.priceValue;
        },
        message: 'Discount price ({{VALUE}) should be below the regular price'
      }
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
    },
    category: {
      type: String,
      required: [true, 'A course must have a category!'],
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty is either: easy, medium or hard!'
      }
    },
    secretCourse: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

courseSchema.virtual('includesVideosMinutes').get(function() {
  return this.includesVideos * 10;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
courseSchema.pre('save', function(next) {
  // console.log(this);
  this.slug = slugify(this.title, { lower: true });
  next();
});

// courseSchema.pre('save', function(next) {
//   console.log('Will same document...');
//   next();
// });

// courseSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
courseSchema.pre(/^find/, function(next) {
  this.find({ secretCourse: { $ne: true } });

  this.start = Date.now();

  next();
});

courseSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  // console.log(docs);

  next();
});

// AGGREGATION MIDDLEWARE
courseSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({ $match: { secretCourse: { $ne: true } } });

  console.log(this.pipeline());

  next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
