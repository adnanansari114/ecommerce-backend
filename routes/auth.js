const express = require('express');
const router = express.Router();
const { register,verifyOTP ,login, adminLogin, getProfile, updateProfile, uploadProfilePhoto } = require('../controllers/authController');
const { authUser } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const multer = require('multer');
const path = require('path');
const passport = require('passport');
const jwt = require('jsonwebtoken');

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

router.post('/verify-otp', verifyOTP);

// Upload/change profile photo
router.post('/profile/photo', authUser, upload.single('profilePhoto'), uploadProfilePhoto);



router.get('/google',
  (req, res, next) => {
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// Callback route
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/auth/fail` }),
  (req, res) => {
    const jwt = require('jsonwebtoken');
    const user = req.user;
    const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);

    // const redirectUrl = `${process.env.CLIENT_URL}/auth/success#token=${token}`;
    // res.redirect(redirectUrl);
  }
);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

module.exports = router;