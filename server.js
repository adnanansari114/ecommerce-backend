const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db'); 
// const passport = require('passport');

const app = express();

const allowedOrigins = process.env.CLIENT_URL || 'https://ecommerce-frontend-bttv.onrender.com';
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// const staticPageRoutes = require('./routes/staticpage'); // OK if staticpage.js exports a router
// app.use('/api/staticpage', staticPageRoutes); // This is correct

// app.use(passport.initialize());
// require('./config/passport')(passport);

app.use('/api/auth', require('./routes/auth')); 
app.use('/api/product', require('./routes/product'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/orders', require('./routes/order'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/contact', require('./routes/contactMessage'));
// app.use('/api/pages', require('./routes/staticpage')); 
app.get('/', (req, res) => res.send('API is running...'));

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT} and MongoDB connected successfully.`));
  })
  .catch(err => {
    console.error("Failed to start server due to DB connection error:", err);
    process.exit(1);
  });
