const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors'); // colors library to color text in to console (this is optional)
//const logger = require('./middleware/logger');
const morgan = require('morgan');
//
const errorHandler = require('./middleware/error');
// importing connectDB method from db.js to connect to MongoDB
const connectDB = require('./config/db');

// Load env variables
dotenv.config({ path: './config/config.env'});

// connectDB() method must be somewhere under the line that loading the environment variables config file (lines above)
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');

const app = express();

// Body Parser
app.use(express.json());

// Dev logging middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Our custom logger using logger.js middlware --- (no longer using this. Using Morgan)
//app.use(logger);

// Mount routers
app.use('/api/v1/bootcamps', bootcamps); //mounts the bootcamps routes from bootcamps.js onto the url /api/v1/bootcamps

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

