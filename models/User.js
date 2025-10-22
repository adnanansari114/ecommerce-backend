const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  password: { type: String, required: true },
  agreed: { type: Boolean, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  profilePhoto: { type: String }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema, 'user');