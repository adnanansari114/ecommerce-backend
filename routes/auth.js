const express = require('express');
const router = express.Router();
const { register, login, adminLogin, getProfile, updateProfile, uploadProfilePhoto } = require('../controllers/authController');
const { authUser } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user.id + '_profile' + ext);
  }
});
const upload = multer({ storage });

// User
router.post('/register', register);
router.post('/login', login);

// Admin (no register route)
router.post('/admin/login', adminLogin);

// Get profile
router.get('/profile', authUser, getProfile);

// Update profile (address, gender, etc.)
router.put('/profile', authUser, updateProfile);

// Upload/change profile photo
router.post('/profile/photo', authUser, upload.single('profilePhoto'), uploadProfilePhoto);

module.exports = router;