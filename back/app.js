const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
// Import routes
const usersRoutes = require('./routes/users');
const saucesRoutes = require('./routes/sauces');





dotenv.config();

// enable cross-origin resource sharing CORS
app.all('*', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Connect to DB
mongoose.connect(process.env.CONNECTION_DB, 
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connection à MongoDB réussie !'))
.catch(() => console.log('Connection à MongoDB échouée !'));



// Middleware
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));

// Route Middlewares
app.use('/api/auth', usersRoutes);
app.use('/api/sauces', saucesRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})