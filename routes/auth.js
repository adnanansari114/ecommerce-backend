const express = require('express');
const router = express.Router();
const { register, 
        verifyOTP, 
        login, 
        adminLogin, 
        getProfile, 
        updateProfile, 
        uploadProfilePhoto,
        changePassword, 
        forgotPassword,
        resetPassword  
      } = require('../controllers/authController');
const { authUser } = require('../middleware/authMiddleware');
const { adminMiddleware } = require('../middleware/adminMiddleware');
const multer = require('multer');
const path = require('path');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user.id + '_profile' + ext);
  }
});
const upload = multer({ storage });

router.post('/register', register);
router.post('/login', login);
router.post('/admin/login', adminLogin);
router.get('/profile', authUser, getProfile);
router.put('/profile', authUser, updateProfile);
router.post('/verify-otp', verifyOTP);
router.post('/profile/photo', authUser, upload.single('profilePhoto'), uploadProfilePhoto);

router.get('/google',
  (req, res, next) => {
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/auth/fail` }),
  (req, res) => {
    const jwt = require('jsonwebtoken');
    const user = req.user;
    const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`);
  }
);

router.put('/change-password', authUser, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;