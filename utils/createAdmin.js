const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const email = "admin@trendora.com";
  const password = "admin123";
  const exists = await Admin.findOne({ email });
  if (exists) {
    console.log("Admin already exists");
    process.exit();
  }
  const hash = await bcrypt.hash(password, 10);
  await Admin.create({ email, password: hash });
  console.log("Admin created:", email);
  process.exit();
};

createAdmin();