const Grade = require('../models/grade');

exports.getGrades = async (req, res) => {
    const grades = await Grade.find();
    res.json(grades);
};

exports.addGrade = async (req, res) => {
    const newGrade = new Grade(req.body);
    await newGrade.save();
    res.status(201).json(newGrade);
};