const jwt = require('jsonwebtoken');
const {startScheduler}=require('../cron/scheduler');

const userSocketMap=new Map();

const initializeSocket = (io) => {

    io.use((socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error: No token provided.'));
        }
        
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = payload.user.id; 
        next();
      } catch (err) {
        console.error('Socket Auth Error:', err.message);
        next(new Error('Authentication error: Invalid token.'));
      }
    });
    io.on('connection',(socket)=>{
        console.log(`✅ User connected: ${socket.id} (UserId: ${socket.userId})`);
        userSocketMap.set(socket.userId.toString(),socket.id);

        socket.on('disconnect',()=>{
            console.log(`❌ User disconnected: ${socket.id} (UserId: ${socket.userId})`);
            userSocketMap.delete(socket.userId.toString());
        });

    });

    console.log('Starting scheduler..');
    startScheduler(io,userSocketMap);
};

module.exports=initializeSocket;

