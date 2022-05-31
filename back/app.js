const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
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


app.use(express.static('images'));

// Middleware
app.use(express.json());

// Route Middlewares
app.use('/api/auth', usersRoutes);
app.use('/api/sauces', saucesRoutes);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})