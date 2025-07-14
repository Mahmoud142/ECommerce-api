const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const multer = require('multer');
// To handle form-data (multipart/form-data), use multer or a similar middleware
const upload = multer();

// Use multer for parsing multipart/form-data
app.use(upload.none());
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
app.use('/upload', express.static(path.join(__dirname, 'uploads')));
// Serve static files from the 'uploads' directory
const uploadRoutes = require('./routes/upload.route');
app.use('/api/upload', uploadRoutes);


// =========starting Server===========
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});