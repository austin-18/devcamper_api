// NOTE: All model files are to begin with an uppercase letter. 
//       All controller files are to begin with a lowercase letter

// importing the model into the controller
const Bootcamp = require('../models/Bootcamp');

// Controller files conain the Methods for each route - creates functionality for the route

// @desc:    Get all bootcamps
// @route:   GET /api/v1/bootcamps
// @access:  Public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'show all bootcamps'
    });
}

// @desc:    Get bootcamp bty ID
// @route:   GET /api/v1/bootcamps/:id
// @access:  Public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `show bootcamp ${req.params.id}`
    });
}

// @desc:    create new bootcamp
// @route:   POST /api/v1/bootcamps
// @access:  Private
exports.createBootcamp = async(req, res, next) => {    
    try {
        const bootcamp = await Bootcamp.create(req.body); // when using async/await, must create new variable to access data from whatever is awaiting

        // setting status as 201 because we're creating new data
        res.status(201).json({
            success: true,
            data: bootcamp
        });
    } catch (err) {
        // setting status to 400 if an error occurs and setting success to false
        res.status(400).json({
            success: false
        });
    }
}

// @desc:    update bootcamp by ID
// @route:   PUT /api/v1/bootcamps/:id
// @access:  Private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `update bootcamp ${req.params.id}`
    });
}

// @desc:    delete bootcamp by Id
// @route:   DELETE /api/v1/bootcamps
// @access:  Private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `delete bootcamp ${req.params.id}`
    });
}