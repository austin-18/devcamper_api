// NOTE: All model files are to begin with an uppercase letter. 
//       All controller files are to begin with a lowercase letter

// Importing ErrorResponse Class (contains a constructor)
const ErrorResponse = require('../utils/errorResponse');
// importing the asyncHandler middleware that will eliminate the need for try/catch blocks with next() methods
const asyncHandler = require('../middleware/async');
// importing the model into the controller
const Course = require('../models/Course');

// @desc:    Get courses
// @route:   GET /api/v1/courses
// @route:   GET /api/v1/courses/bootcamps/:bootcampID/courses
// @access:  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;

    if(req.params.bootcampID) {
        query = Course.find({
            bootcamp: req.params.bootcampID
        });
    } else {
        query = Course.find().populate({ // .populate() will allow us to fill the bootcamp section with whatever bootcamp data we want from the bootcamp DB
            path: 'bootcamp',
            select: 'name description' // we pick to show the bootcamp "name" and "description" fields
        }); 
    }

    const courses = await query;

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });


})