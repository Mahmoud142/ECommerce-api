const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

// for refresh token
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const upload = require('multer');
// app.use(upload().any());


app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
//=========Routes===========
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const productRoutes = require('./routes/product.route');
const orderRoutes = require('./routes/order.route');
const categoryRoutes = require('./routes/category.route');
const subCategoryRoutes = require('./routes/subcategory.route');
const brandRoutes = require('./routes/brand.route');
// Mounting routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);


const { SUCCESS, FAIL, ERROR } = require('./utils/httpStatusText');
// Handle 404 for undefined routes
app.use((req, res) => {
  return res.status(404).json({ status: ERROR, message: `Route ${req.originalUrl} not found` });
});

// Global Error middleware
app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    status: err.statusText || ERROR,
    message: err.message || 'Internal Server Error',
    code: err.statusCode || 500,
    data: null
  });
})




// =========starting Server===========
const connectDB = require('./config/db');
app.listen(PORT, () => {
  console.log(`Server is running on ${process.env.BASE_URL}`);
  connectDB();
});