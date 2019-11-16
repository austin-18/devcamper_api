const express = require('express');
const { // importing the methods from the controller file
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/users');

const User = require('../models/User');


const router = express.Router({
    mergeParams: true
});

const advancedResults = require('../middleware/advancedResults');
// bringing in protect middleware to protect routes. Add this inside the request method (.get, .post, etc) before the called method to make that route protected
const { protect, authorize } = require('../middleware/auth');

// any routes below these lines will default to using 'protect' and 'authorize('admin')' options. Dont need to specifiy inside router.
router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
    .get(advancedResults(User), getUsers)
    .post(createUser);

router
    .route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);


module.exports = router;