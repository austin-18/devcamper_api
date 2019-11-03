const express = require('express');
const { // importing the methods from the controller file
    getCourses
} = require('../controllers/courses');

const router = express.Router({
    mergeParams: true
});

router.route('/').get(getCourses);

module.exports = router;