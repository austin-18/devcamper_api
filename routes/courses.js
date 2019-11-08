const express = require('express');
const { // importing the methods from the controller file
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
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
    .put(updateCourse)
    .delete(deleteCourse);

module.exports = router;