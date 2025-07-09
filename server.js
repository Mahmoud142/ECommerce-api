const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

require('dotenv').config();

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



// =========starting Server===========
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});