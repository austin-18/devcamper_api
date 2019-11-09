const express = require('express');
const { // importing the methods from the controller file
    getBootcamps, 
    getBootcamp, 
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

// include other resource routers
const courseRouter = require('./courses');

const router = express.Router();

// re-route into other resource routers
router.use('/:bootcampID/courses', courseRouter); // if url contains '/:bootcampID/courses', we will re-route to the other specified router

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);


router // defining methods that belong to the '/' path
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(createBootcamp);

router // defining methods that belong to the '/:id' path
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

router
    .route('/:id/photo').put(bootcampPhotoUpload);

module.exports = router;