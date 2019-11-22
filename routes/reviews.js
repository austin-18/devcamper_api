const express = require('express');
const { // importing the methods from the controller file
    getReviews,
    getReview,
    addReview
} = require('../controllers/reviews');

const Review = require('../models/Review');

const router = express.Router({
    mergeParams: true
});

const advancedResults = require('../middleware/advancedResults');
// bringing in protect middleware to protect routes. Add this inside the request method (.get, .post, etc) before the called method to make that route protected
const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(advancedResults(Review, {
        path: 'bootcamp',
        select: 'name description'
    }), getReviews)
    .post(protect, authorize('user', 'admin'), addReview);

router
    .route('/:id')
    .get(getReview);
    
module.exports = router;