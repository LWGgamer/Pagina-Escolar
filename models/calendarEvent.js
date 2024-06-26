const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
    title: String,
    date: Date,
    description: String
});

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);