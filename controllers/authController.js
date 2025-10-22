const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const OTP = require('../models/OTP');
const sendEmail = require('../utils/sendEmail');
const otpGenerator = require('otp-generator');

exports.register = async (req, res) => {
  try {
    const { name, username, email, phone, password, confirmPassword, agreed } = req.body;

    if (!name || !username || !email || !password || !confirmPassword || !agreed)
      return res.status(400).json({ msg: 'All fields are required and privacy must be agreed.' });

    if (password !== confirmPassword)
      return res.status(400).json({ msg: 'Passwords do not match.' });

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists)
      return res.status(400).json({ msg: 'Username or Email already exists.' });

    // Generate OTP
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    await OTP.create({ email, otp });

    // Send OTP via Brevo
    const html = `
      <h2>Welcome to Trendora, ${name}!</h2>
      <p>Your OTP for registration is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 5 minutes.</p>
    `;
    await sendEmail(email, "Trendora Registration OTP", html);

    res.status(200).json({ msg: "OTP sent successfully to your email." });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// STEP 2: Verify OTP and complete registration
exports.verifyOTP = async (req, res) => {
  try {
    const { name, username, email, phone, password, agreed, otp } = req.body;

    const validOTP = await OTP.findOne({ email, otp });
    if (!validOTP) return res.status(400).json({ msg: 'Invalid or expired OTP' });

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Save user
    const user = await User.create({ name, username, email, phone, password: hash, agreed });

    // Remove OTP from DB
    await OTP.deleteOne({ _id: validOTP._id });

    res.status(201).json({ msg: 'Registration successful', user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
    });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// Admin Login (only one admin, no register)
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ msg: 'Invalid admin credentials' });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ msg: 'Invalid admin credentials' });

    const token = jwt.sign({ id: admin._id, email: admin.email, admin: true }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, admin: { email: admin.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Update profile (except password)
// Update profile (except password)
exports.updateProfile = async (req, res) => {
  try {
    const update = {};
    if (req.body.name) update.name = req.body.name;
    if (req.body.phone) update.phone = req.body.phone;
    if (req.body.address) update.address = req.body.address;
    if (req.body.gender) update.gender = req.body.gender;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      update,
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ msg: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Upload/change profile photo
exports.uploadProfilePhoto = async (req, res) => {
  try { 
    if (!req.file) return res.status(400).json({ msg: "No file uploaded" });
    // For production, use: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
    const photoPath = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePhoto: photoPath },
      { new: true }
      
    ).select('-password');
    res.json({ msg: "Profile photo updated", user });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


// CHANGE PASSWORD - User must be logged in
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ msg: 'New passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Old password is incorrect' });
    }

    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 10);
    
    // Update password
    user.password = newHash;
    await user.save();

    res.json({ msg: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// FORGET PASSWORD - STEP 1: Send OTP to email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Email not found' });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    await OTP.create({ email, otp });

    // Send OTP via Brevo
    const html = `
      <h2>Trendora Password Reset</h2>
      <p>Hi ${user.name},</p>
      <p>Your OTP for password reset is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 5 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;
    
    await sendEmail(email, "Trendora Password Reset OTP", html);

    res.status(200).json({ msg: "OTP sent successfully to your email" });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// FORGET PASSWORD - STEP 2: Verify OTP and reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    // Verify OTP
    const validOTP = await OTP.findOne({ email, otp });
    if (!validOTP) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    user.password = newHash;
    await user.save();

    // Delete OTP
    await OTP.deleteOne({ _id: validOTP._id });

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};