// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { getDashboardSummary, getDashboardActivity } = require('../controllers/dashboardController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/summary', authMiddleware, getDashboardSummary);
router.get('/activity', authMiddleware, getDashboardActivity);

module.exports = router;
