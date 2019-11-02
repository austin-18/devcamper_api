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

// Controller files conain the Methods for each route - creates functionality for the route

// @desc:    Get all bootcamps
// @route:   GET /api/v1/bootcamps
// @access:  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    let query;

    const reqQuery = {...req.query}; // making a copy of an object using the spread operator "..."
    
    // Fields to exclude from query
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);



    // create query string
    let queryString = JSON.stringify(reqQuery);
    // create operators ($gt, $gte, etc)
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    //console.log(queryString);
    // finding resources
    query = Bootcamp.find(JSON.parse(queryString));

    // Select Fields
    if(req.query.select){
        // This will split the SELECT fields wherever there is a comma (creates an array) and then join the array elements back together with a space
        // Note: URL query (denoted by "?") will look like this :{{URL}}/api/v1/bootcamps/?select=name,discription 
        //          where "name" and "description" are what we want to select (filter) to return
        //      Mongoose requres the fields to be separated by a space, so we use .split(",").join(" ") to replace commas with spaces
        const fields = req.query.select.split(',').join(' '); 
        query = query.select(fields);
    }

    // sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        // Note: putting a "-" before the sort field will reverse the 
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt') // else statement will sort by date if no other sort is specifed ("-" addition means most recent date first, oldest last)
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1; // creates page 1 as the default with page being base 10
    const limit = parseInt(req.query.limit, 10) || 25; // creates limit of 25 results by default with base 10
    const startIndex = (page-1)*limit; // calculates first result on the page based on page and limit
    const endIndex = page * limit; // calculates the last result on the page based on page and limit
    const total = await Bootcamp.countDocuments(); // finds the total number of results available


    query = query.skip(startIndex).limit(limit);


    //const bootcamps = await Bootcamp.find();
    // executing query
    const bootcamps = await query;

    // Pagination result - will be an empty object if a single page returns all the results
    const pagination = {};

    // if endIdex is not at the end of the total results, we will allow there to be another page next
    if(endIndex < total) {
        pagination.next = {
            page: page+1,
            limit // since variable name is same as our key name, we can do this instead of limit: limit
        }
    }

    // if startIndex is not at the begining of the results (0), we allow there to be a previous page
    if(startIndex > 0) {
        pagination.prev = {
            page: page-1,
            limit // since variable name is same as our key name, we can do this instead of limit: limit
        }
    }

    res.status(200).json({
        success: true,
        count: bootcamps.length,
        pagination, // since variable name is same as our key name, we can do this instead of pagination: pagination
        data: bootcamps
        });
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