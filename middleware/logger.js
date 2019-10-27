// All middleware will take the req, res, next 

// @desc    logs request to console
const logger = (req, res, next) => {
    //req.hello = 'hello world'; // created the hello variable on the req object. It is now accessable in any route controller.
    console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next(); // must always call next(); so that the middleware knows to move on when done
};

module.exports = logger;