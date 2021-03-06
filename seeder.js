const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// load env variables
dotenv.config({path: './config/config.env'});

// load models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');

// connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// read JSON files
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

const users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const reviews = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);

// import into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps); // no need to define as "const" since we are just doing a one time create.
        await Course.create(courses); // no need to define as "const" since we are just doing a one time create.
        await User.create(users); // no need to define as "const" since we are just doing a one time create.
        await Review.create(reviews); // no need to define as "const" since we are just doing a one time create.

        console.log('Data imported...'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

// delelte DB
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany(); // deletes all DB entries if nothing is passed into the method
        await Course.deleteMany(); // deletes all DB entries if nothing is passed into the method
        await User.deleteMany(); // deletes all DB entries if nothing is passed into the method
        await Review.deleteMany(); // deletes all DB entries if nothing is passed into the method

        console.log('Data destroyed...'.red.inverse);
        process.exit();
    } catch (error) {
        console.error(error);
    }
};

// here we will use terminal line commands to seed or delete our database
if(process.argv[2]==='-i') { // if command is  "node seeder -i" we will import the data into the DB
    importData();
} else if(process.argv[2]==='-d'){ // if command is "node seeder -d" we will delete the data in the DB
    deleteData();
}