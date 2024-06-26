const CalendarEvent = require('../models/calendarEvent');

exports.getEvents = async (req, res) => {
    const events = await CalendarEvent.find();
    res.json(events);
};

exports.addEvent = async (req, res) => {
    const newEvent = new CalendarEvent(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
};