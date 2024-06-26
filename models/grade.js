const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    student: String,
    subject: String,
    grade: Number
});

module.exports = mongoose.model('Grade', gradeSchema);