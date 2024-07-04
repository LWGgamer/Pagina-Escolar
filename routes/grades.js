const express = require('express');
const router = express.Router();
const Grade = require('../models/grade');

// GET all grades
router.get('/', async (req, res) => {
    try {
        const grades = await Grade.find();
        res.json(grades);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a new grade
router.post('/', async (req, res) => {
    const grade = new Grade({
        student: req.body.student,
        grade: req.body.grade
    });

    try {
        const newGrade = await grade.save();
        res.status(201).json(newGrade);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;