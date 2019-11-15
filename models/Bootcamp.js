// NOTE: All model files are to begin with an uppercase letter. 
//       All controller files are to begin with a lowercase letter

const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    slug: String, // A slug is a URL friendly version of the name object  
                 //     (eg. if name was: Devcentral Bootcamp  --> then the slug would be: devcentral-bootcamp)
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
        ]
    },
    phone:{
        type: String,
        maxlength: [20, 'Phone number caannot be longer than 20 characters']
    },
    email: {
        type: String,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please add a valid email'
        ]
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    location: {
        //GeoJSON Point
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    careers: {
        // Array of strings
        type: [String],
        required: true,
        enum: [ // defining the only available values that the users can pick
            'Web Development',
            'Mobile Development',
            'UI/UX',
            'Data Science',
            'Business',
            'Other'
        ]
    },
    averageRating: {
        type: Number,
        min: [1, 'Rating must at least be 1'],
        max: [10, 'Rating cannt be more than 10']
    },
    averageCost: Number,
    photo: {
        type: String, // this will be a filename path for the photo being uploaded
        default: 'no-photo.jpg' // this would be the name for the default photo that is displayed
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: { // user object to ensure that every bootcamp has a user tied to it.
        type: mongoose.Schema.ObjectId,
        ref: 'User', // the model that this
        required: true
    },
}, {
    strict: 'throw',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create bootcamp slug from the name
BootcampSchema.pre('save', function(next) {  // .pre is pre-ware. This is middleware that will execute before data is saved to the DB
    this.slug = slugify(this.name, {lower: true});  // "this." syntax refers to the name and slug properties above in the model
    //console.log('Slugify ran,', this.name);
    next();
});

// Geocode & create location field for mapquest api
BootcampSchema.pre('save', async function(next) {
    const loc = await geocoder.geocode(this.address);
    // loc variable is filled from mapquest. it returns an array containing a single object. This is why we must use loc[0]
    //this.location refers to the location in the BootcampSchema model above. We are setting its parameters to the mapquest generated data.
    this.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
        formattedAddress: loc[0].formattedAddress,
        street: loc[0].streetName,
        city: loc[0].city,
        state: loc[0].stateCode,
        zipcode: loc[0].zipcode,
        country: loc[0].countryCode
    }

    // Do not save address in DB
    this.address = undefined;
    next();
});

// Cascade delete all related courses when a bootcamp is deleted
BootcampSchema.pre('remove', async function(next) {
    console.log(`Courses being removed from bootcamp ${this._id}`);
    await this.model('Course').deleteMany({ bootcamp: this._id });
    next();
});


// Reverse populate with virtuals (must create the virtual on the Schema)
BootcampSchema.virtual('courses', {
    ref: 'Course', // Reference to the model we will be using
    localField: '_id', // local field to tie to
    foreignField: 'bootcamp', // foreign field in the Course model that we want to pertain to
    justOne: false // we want to get an array of all the courses for each bootcamp
})

module.exports = mongoose.model('Bootcamp', BootcampSchema);