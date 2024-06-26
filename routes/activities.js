const express = require('express');
const router = express.Router();
const activitiesController = require('../controllers/activitiesController');

router.get('/', activitiesController.getActivities);
router.post('/', activitiesController.addActivity);

module.exports = router;