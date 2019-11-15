// Importing ErrorResponse Class (contains a constructor)
const ErrorResponse = require('../utils/errorResponse');
// importing the asyncHandler middleware that will eliminate the need for try/catch blocks with next() methods
const asyncHandler = require('../middleware/async');
// importing the model into the controller
const User = require('../models/User');

// @desc:    Register User
// @route:   POST /api/v1/auth/register
// @access:  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // create our user (this user is a static therefore we keep it lowercase)
    // statics are derived from the model, methods are performed directly on the model
    const user = await User.create({
        name: name,
        email: email,
        password: password,
        role: role
    });

    sendTokenResponse(user, 200, res);

});

// @desc:    Login User
// @route:   POST /api/v1/auth/login
// @access:  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email and password
    if(!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user (finding by email, and then including password after finding)
    const user = await User.findOne({ email: email }).select('+password');

    if(!user){
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);

});

// @desc:    get current logged in User
// @route:   POST /api/v1/auth/me
// @access:  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    // Dont need lower line since this route is already protected. No need to re-find user, user is already found in protected route
    // const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: req.user // can use <req.user> here instead of <user>. See comments above
    });
});

// @desc:    forgot password
// @route:   POST /api/v1/auth/forgotpassword
// @access:  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if(!user){
        return next(new ErrorResponse('There is no user with that email', 404));
    }

    // get rest token
    const resetToken = user.getResetPasswordToken();
    
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        data: user
    });
});

// Get token from model, create cookie, and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token (static)
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000)), // JWT takes time in milliseconds. Here we convert it to days (30 days)
        httpOnly: true
    };

    // setting secure flag to true if application is production (cookie is sent with HTTPS)
    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options) // .cookie() takes in .cookie('key', key_value, options)
        .json({
            success: true,
            token: token
        });
};