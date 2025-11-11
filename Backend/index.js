const express = require('express');
const http = require('http'); // 1. We need the 'http' module
const { Server } = require('socket.io'); // 2. Import Socket.IO Server
require('dotenv').config();
const db = require('./models');
const passport = require('passport');
const cors = require('cors');

// --- 3. Import our new, separated logic ---
const initializeSocket = require('./socket/socketHandler');

const app = express();

const corsOptions = {
 origin: 'http://localhost:5173',
 methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Added PATCH
 allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
 credentials: true
}
app.use((req, res, next) => {
 console.log(`REQUEST RECEIVED: ${req.method} ${req.path}`);
 next(); 
});

app.use(cors(corsOptions));
app.use(express.json());
require('./config/passport-setup');
app.use(passport.initialize());

// --- API Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/ProfileRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes')); 


const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions 
});

initializeSocket(io);


const PORT = process.env.PORT || 5001;
db.sequelize.sync({ alter: true }).then(() => {

 server.listen(PORT, () => console.log(`Server and Socket.IO running on port ${PORT}`));
}).catch(err => {
 console.error('Failed to sync db: '+err.message);
});

