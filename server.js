const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors'); // colors library to color text in to console (this is optional)
//const logger = require('./middleware/logger');
const morgan = require('morgan');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const monoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
const errorHandler = require('./middleware/error');
const path = require('path');
// importing connectDB method from db.js to connect to MongoDB
const connectDB = require('./config/db');



// Load env variables
dotenv.config({ path: './config/config.env'});

// connectDB() method must be somewhere under the line that loading the environment variables config file (lines above)
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// Sanitize data
app.use(monoSanitize());

// Security Headers
app.use(helmet());

// Prevent XSS (cross site scripting) attacks
app.use(xss());

// Rate Limiting 
const limiter = rateLimit({
    windowMs: 10*60*1000, // 10 minutes
    max: 100 // max number of requests per time window
});
app.use(limiter);

// Prevent http param polution
app.use(hpp());

// enable CORS - allows mulitple domains to access the API. Commonly used for if front-end is on different domain than backend API domain
app.use(cors());

// Set static folder
// this allows us to go to {{path}}/uploads/<imageName.jpg> to see the photo in the browser
app.use(express.static(path.join(__dirname, 'public')));


// Our custom logger using logger.js middlware --- (no longer using this. Using Morgan)
//app.use(logger);

// Mount routers
app.use('/api/v1/bootcamps', bootcamps); //mounts the bootcamps routes from bootcamps.js onto the url /api/v1/bootcamps
app.use('/api/v1/courses', courses); //mounts the course routes from courses.js onto the url /api/v1/courses
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

// Using errorHandler methods (must puse below the URL routers)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handling unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // close server and exit process
    server.close(() => process.exit(1));
});

