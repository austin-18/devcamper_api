// NOTE: All model files are to begin with an uppercase letter. 
//       All controller files are to begin with a lowercase letter

// 
const ErrorResponse = require('../utils/errorResponse');
// importing the model into the controller
const Bootcamp = require('../models/Bootcamp');



// Controller files conain the Methods for each route - creates functionality for the route

// @desc:    Get all bootcamps
// @route:   GET /api/v1/bootcamps
// @access:  Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();

        res.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        });

    } catch (error) {
        // setting status to 400 if an error occurs and setting success to false
        // res.status(400).json({
        //     success: false
        // });
        next(error);
    }
};

// @desc:    Get bootcamp bty ID
// @route:   GET /api/v1/bootcamps/:id
// @access:  Public
exports.getBootcamp = async (req, res, next) => {
    try {
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

    } catch (error) {
        // setting status to 400 if an error occurs and setting success to false
        // this will catch if the format of the POSTed ID is incorrect, but will miss
        //      if the ID is the correct format but doesnt actually exist in the database
        //      The IF statement above catches correct format but non-existant ID
        // res.status(400).json({
        //     success: false
        // });
        next(error);
    }
};

// @desc:    create new bootcamp
// @route:   POST /api/v1/bootcamps
// @access:  Private
exports.createBootcamp = async (req, res, next) => {    
    try {
        const bootcamp = await Bootcamp.create(req.body); // when using async/await, must create new variable to access data from whatever is awaiting

        // setting status as 201 because we're creating new data
        res.status(201).json({
            success: true,
            data: bootcamp
        });
    } catch (error) {
        // setting status to 400 if an error occurs and setting success to false
        // res.status(400).json({
        //     success: false
        // });
        next(error);
    }
};

// @desc:    update bootcamp by ID
// @route:   PUT /api/v1/bootcamps/:id
// @access:  Private
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // IF statement will catch the if the ID that is DELETEed doesnt exist in the database, but it is correct format
        if(!bootcamp) {
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: bootcamp
        });

    } catch (error) {
        // res.status(400).json({
        //     success: false
        // });
        next(error);
    }
};

// @desc:    delete bootcamp by Id
// @route:   DELETE /api/v1/bootcamps
// @access:  Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

        // IF statement will catch the if the ID that is DELETEed doesnt exist in the database, but it is correct format
        if(!bootcamp) {
            return next(
                new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
            );
        }

        res.status(200).json({
            success: true,
            data: {}
        });

    } catch (error) {
        // res.status(400).json({
        //     success: false
        // });
        next(error);
    }
};