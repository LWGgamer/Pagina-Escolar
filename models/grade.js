const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    student: {
        type: String,
        required: true
    },
    grade: {
        type: Number,
        required: true
    }
});

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;