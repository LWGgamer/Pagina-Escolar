const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: String,
    dueDate: Date,
    description: String
});

module.exports = mongoose.model('Activity', activitySchema);
