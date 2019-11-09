// NOTE: All model files are to begin with an uppercase letter. 
//       All controller files are to begin with a lowercase letter

// Importing ErrorResponse Class (contains a constructor)
const ErrorResponse = require('../utils/errorResponse');
// importing the asyncHandler middleware that will eliminate the need for try/catch blocks with next() methods
const asyncHandler = require('../middleware/async');
// importing the model into the controller
const Bootcamp = require('../models/Bootcamp');
// importing geocoder for getBootcampsInRadius
const geocoder = require('../utils/geocoder');
const path = require('path');

// Controller files conain the Methods for each route - creates functionality for the route

// @desc:    Get all bootcamps
// @route:   GET /api/v1/bootcamps
// @access:  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc:    Get bootcamp bty ID
// @route:   GET /api/v1/bootcamps/:id
// @access:  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    // IF statement will catch the if the ID that is POSTed doesnt exist in the database, but it is correct format
    if(!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    });
});

// @desc:    create new bootcamp
// @route:   POST /api/v1/bootcamps
// @access:  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {    
    const bootcamp = await Bootcamp.create(req.body); // when using async/await, must create new variable to access data from whatever is awaiting

    // setting status as 201 because we're creating new data
    res.status(201).json({
        success: true,
        data: bootcamp
    });

});

// @desc:    update bootcamp by ID
// @route:   PUT /api/v1/bootcamps/:id
// @access:  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // IF statement will catch the if the ID that is UPDATEDed doesnt exist in the database, but it is correct format
    if(!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: bootcamp
    });
});

// @desc:    delete bootcamp by Id
// @route:   DELETE /api/v1/bootcamps/:id
// @access:  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    // IF statement will catch the if the ID that is DELETEed doesnt exist in the database, but it is correct format
    if(!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }

    bootcamp.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});


// @desc:    get bootcamps within a radius
// @route:   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access:  Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const {zipcode, distance} = req.params;

    // Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Calc radius using radians
    // divide distance by radius of earth
    // Radius of earth = 3,963 miles / 6,378 km
    const radius = distance / 3963;

    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: {
                $centerSphere: [[lng, lat], radius]
            }
        }
    });

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
    
});

// @desc:    upload photo for bootcamp
// @route:   DELETE /api/v1/bootcamps/:id/photo
// @access:  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);

    // IF statement will catch the if the ID that is DELETEed doesnt exist in the database, but it is correct format
    if(!bootcamp) {
        return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
        );
    }

    if(!req.files) {
        return next(
            new ErrorResponse(`Please upload a file`, 400)
        );
    }

    const file = req.files.file;
    console.log(file);

    // Make sure that the image is a photo
    if(!file.mimetype.startsWith('image')) {
        return next(
            new ErrorResponse(`Please upload an image file`, 400)
        );
    }

    // Check file size
    if(file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD} bytes`, 400)
        );
    }

    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    // Move uploaded file
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async error => {
        if(error){
            console.error(error);
            
            return next(
                new ErrorResponse(`Problem with file upload`, 500)
            );
        }

        await Bootcamp.findByIdAndUpdate(req.params.id, {photo: file.name});

        //console.log(file.name);
        res.status(200).json({
            success: true,
            data: file.name
        });
    })


});