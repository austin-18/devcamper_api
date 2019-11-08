// NOTE: All model files are to begin with an uppercase letter. 
//       All controller files are to begin with a lowercase letter

// Importing ErrorResponse Class (contains a constructor)
const ErrorResponse = require('../utils/errorResponse');
// importing the asyncHandler middleware that will eliminate the need for try/catch blocks with next() methods
const asyncHandler = require('../middleware/async');
// importing the models into the controller
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

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
});

// @desc:    Get single courses
// @route:   GET /api/v1/course/:id
// @access:  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if(!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }

    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc:    Add a course
// @route:   POST /api/v1/bootcamps/:bootcampID/courses
// @access:  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampID;


    const bootcamp = await Bootcamp.findById(req.params.bootcampID)

    if(!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`), 404);
    }

    const course = await Course.create(req.body)

    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc:    Update a course
// @route:   PUT /api/v1/course/:id
// @access:  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {

    let course = await Course.findById(req.params.id)

    if(!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: course
    });
});

// @desc:    Delete a course
// @route:   DELETE /api/v1/course/:id
// @access:  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

    const course = await Course.findById(req.params.id)

    if(!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404);
    }

   await course.remove()

    res.status(200).json({
        success: true,
        data: {}
    });
});