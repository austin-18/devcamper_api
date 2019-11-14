const mongoose = require('mongoose');
const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a course discription']
    },
    weeks: {
        type: String,
        required: [true, 'Please add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Please add a tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: { // bootcamp object to ensure that every course has a bootcamp tied to it.
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: { // bootcamp object to ensure that every course has a bootcamp tied to it.
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

// defining a Static Method to get average of course tuitions
CourseSchema.statics.getAverageCost = async function(bootcampID){
    //console.log('Calculating avg cost...'.blue);

    const obj = await this.aggregate([
        {
            $match: {bootcamp: bootcampID}
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampID, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        });
    } catch (error) {
        console.error(error);
    }
};


// Call getAverageCost after saving
CourseSchema.post('save', function(){
    this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.pre('remove', function(){
    this.constructor.getAverageCost(this.bootcamp);
});



module.exports = mongoose.model('Course', CourseSchema);