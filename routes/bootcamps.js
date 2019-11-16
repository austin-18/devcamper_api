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

// include other resource routers
const courseRouter = require('./courses');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
// bringing in protect middleware to protect/authorize routes. Add this inside the request method (.get, .post, etc) before the called method to make that route protected
const { protect, authorize } = require('../middleware/auth');

// re-route into other resource routers
router.use('/:bootcampID/courses', courseRouter); // if url contains '/:bootcampID/courses', we will re-route to the other specified router

router.route('/radius/:zipcode/:distance').get(protect, getBootcampsInRadius);


router // defining methods that belong to the '/' path
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp);

router // defining methods that belong to the '/:id' path
    .route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router
    .route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

module.exports = router;