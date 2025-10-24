const express = require('express');
require('dotenv').config();
const db = require('./models');
const passport=require('passport');
const cors = require('cors');
const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}
app.use((req, res, next) => {
  console.log(`REQUEST RECEIVED: ${req.method} ${req.path}`);
  next(); 
});



app.use(cors(corsOptions));

// Temporarily disable CSP to test OAuth
// app.use((req, res, next) => {
//   // Remove any existing CSP headers
//   res.removeHeader('Content-Security-Policy');
//   next();
// });

app.use((req, res, next) => {
  console.log('REQUEST GOT PAST CORS');
  next();
});

app.use(express.json());
require('./config/passport-setup');
app.use(passport.initialize());
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile',require('./routes/ProfileRoutes'));

const PORT = process.env.PORT || 5001;

// Backend/index.js (near the bottom)

db.sequelize.sync({ alter: true }).then(() => { // ✅ ADD { alter: true } HERE
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
}).catch(err => {
    console.error('Failed to sync db: '+err.message);
});