const express = require('express');
const router = express.Router();
 const { adminMiddleware } = require('../middleware/adminMiddleware');
const { authUser} = require('../middleware/authMiddleware');
const { getAdminStats, getDashboardStats } = require('../controllers/AdminDashboard');
const { getUserDashboard } = require('../controllers/UserDashboard');

router.get('/user', authUser, getUserDashboard);
router.get('/admin', adminMiddleware, getAdminStats);
router.get('/dashboard', adminMiddleware, getDashboardStats);

module.exports = router;