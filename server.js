require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
const morgan = require('morgan');

app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  next();
});

app.use(morgan('dev', {
  stream: {
    write: (message) => console.log(message.trim())
  }
}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const rateLimit = require('express-rate-limit');
// // Apply rate limiter to all API routes
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     limit: 100, // Limit each IP to 100 requests per window
//     message: { status: 'fail', message: 'Too many requests from this IP, please try again after 15 minutes' }
// });
// app.use('/api', limiter);


app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Swagger API Documentation Route
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));




//=========Routes===========
const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const productRoutes = require('./routes/product.route');
const orderRoutes = require('./routes/order.route');
const categoryRoutes = require('./routes/category.route');
const subCategoryRoutes = require('./routes/subcategory.route');
const brandRoutes = require('./routes/brand.route');
const couponRoutes = require('./routes/coupon.route');
const wishlistRoutes = require('./routes/wishlist.route')
const cartRoutes = require('./routes/cart.route');
const reviewRoutes = require('./routes/review.route');
const addressRoutes = require('./routes/address.route');

// Mounting routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
const reviewRouteNested = require('./routes/review.route');
app.use('/api/products/:productId/reviews', reviewRouteNested);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/addresses', addressRoutes);
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