const express = require('express');
const { // importing the methods from the controller file
    getBootcamps, 
    getBootcamp, 
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp,
    getBootcampsInRadius
} = require('../controllers/bootcamps');

const router = express.Router();

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);


router // defining methods that belong to the '/' path
    .route('/')
    .get(getBootcamps)
    .post(createBootcamp);

router // defining methods that belong to the '/:id' path
    .route('/:id')
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

module.exports = router;