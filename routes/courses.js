const express = require('express');
const { // importing the methods from the controller file
    getCourses,
    getCourse,
    addCourse
} = require('../controllers/courses');

const router = express.Router({
    mergeParams: true
});

router
    .route('/')
    .get(getCourses)
    .post(addCourse);

router
    .route('/:id')
    .get(getCourse)

module.exports = router;