// Importing ErrorResponse Class (contains a constructor)
const ErrorResponse = require('../utils/errorResponse');
// importing the asyncHandler middleware that will eliminate the need for try/catch blocks with next() methods
const asyncHandler = require('../middleware/async');
// importing the model into the controller
const User = require('../models/User');

// @desc:    Register User
// @route:   GET /api/v1/auth/register
// @access:  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // create our user
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    res.status(200).json({success: true});

});