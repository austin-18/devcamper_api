const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {  // get all bootcamps
    // res.send('Hello'); // can put html, text, json in .send() - the header will automatically display the type for us
    // res.status(400).json({success: false});
    res.status(200).json({
        success: true,
        msg: 'show all bootcamps'
    });
});

router.get('/:id', (req, res) => { // get single bootcamp using the bootcamp ID (eg. /bootcamp/1)
    res.status(200).json({
        success: true,
        msg: `show bootcamp ${req.params.id}`
    });
});

router.post('/', (req, res) => {  // create a new bootcamp
    res.status(200).json({
        success: true,
        msg: 'create new bootcamp'
    });
});

router.put('/:id', (req, res) => { // delete a bootcamp by ID
    res.status(200).json({
        success: true,
        msg: `update bootcamp ${req.params.id}`
    });
});

router.delete('/:id', (req, res) => { 
    res.status(200).json({
        success: true,
        msg: `delete bootcamp ${req.params.id}`
    });
});

module.exports = router;