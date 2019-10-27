const express = require('express');
const dotenv = require('dotenv');

// Load env variables
dotenv.config({ path: './config/config.env'});

const app = express();

app.get('/api/v1/bootcamps', (req, res) => {  // get all bootcamps
    // res.send('Hello'); // can put html, text, json in .send() - the header will automatically display the type for us
    // res.status(400).json({success: false});
    res.status(200).json({
        success: true,
        msg: 'show all bootcamps'
    });
});

app.get('/api/v1/bootcamps/:id', (req, res) => { // get single bootcamp using the bootcamp ID (eg. /bootcamp/1)
    res.status(200).json({
        success: true,
        msg: `show bootcamp ${req.params.id}`
    });
});

app.post('/api/v1/bootcamps', (req, res) => {  // create a new bootcamp
    res.status(200).json({
        success: true,
        msg: 'create new bootcamp'
    });
});

app.put('/api/v1/bootcamps/:id', (req, res) => { // delete a bootcamp by ID
    res.status(200).json({
        success: true,
        msg: `update bootcamp ${req.params.id}`
    });
});

app.delete('/api/v1/bootcamps/:id', (req, res) => { 
    res.status(200).json({
        success: true,
        msg: `update bootcamp ${req.params.id}`
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));



