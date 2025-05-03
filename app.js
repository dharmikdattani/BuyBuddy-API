require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const registerRoutes = require("./routes/RegisterRouter");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/product', productRoutes);
app.use('/auth', registerRoutes);
app.use('/order', orderRoutes);
app.use('/payment', paymentRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB ✅'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

mongoose.connection.on('error', () => {
    console.log('Connection failed ❌');
});

module.exports = app;
