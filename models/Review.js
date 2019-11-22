const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add some text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 and 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: { // bootcamp object to ensure that every review has a bootcamp tied to it.
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: { // user object to ensure that every reviuew has a user tied to it.
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

// Prevents user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// defining a Static Method to get average rating and save
ReviewSchema.statics.getAverageRating = async function(bootcampID){
    const obj = await this.aggregate([
        {
            $match: {bootcamp: bootcampID}
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampID, {
            averageRating: obj[0].averageRating
        });
    } catch (error) {
        console.error(error);
    }
};


// Call getAverageRating after saving
ReviewSchema.post('save', function(){
    //console.log('Calculating Rating Average - Post...')
    this.constructor.getAverageRating(this.bootcamp);
});

// Call getAverageRating before remove
ReviewSchema.pre('remove', function(){
    //console.log('Calculating Rating Average - Pre...')
    this.constructor.getAverageRating(this.bootcamp);
});


module.exports = mongoose.model('Review', ReviewSchema);