require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
// const PORT = process.env.PORT;


// =========Database Connection==========
const connectDB = require('./config/db');
connectDB();


// =========Global Route======================
app.get('/api', (req, res) => {
    res.send('Hello World!');
});


//=========auth Routes===========
const authRoutes = require('./routes/auth.route');
app.use('/api/auth', authRoutes);



//=========user Routes===========
const userRoutes = require('./routes/user.route');
app.use('/api/users', userRoutes);



// =========starting Server===========
app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});