const User = require('../models/User');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration
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

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, username, email, phone, password: hash, agreed });
    res.status(201).json({ msg: 'User registered', user: { name: user.name, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// User Login
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