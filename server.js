const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
// const bodyParser = require('body-parser');
require('dotenv').config();

// for refresh token
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// app.use('api/webhook',express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =========Database Connection==========
const connectDB = require('./config/db');

// =========Global Route======================
app.get('/api', (req, res) => {
    res.send('API is Working Correctly');
});


//=========auth Routes===========
const authRoutes = require('./routes/auth.route');
app.use('/api/auth', authRoutes);



//=========user Routes===========
const userRoutes = require('./routes/user.route');
app.use('/api/users', userRoutes);


//=========product Routes===========
const productRoutes = require('./routes/product.route');
app.use('/api/products', productRoutes);

//=========order Routes===========
const orderRoutes = require('./routes/order.route');
app.use('/api/orders', orderRoutes);

//=========upload Routes===========
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
const uploadRoutes = require('./routes/upload.route');
app.use('/api/uploads', uploadRoutes);
//=======Global Error Handler===========
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
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});