const express = require('express');
const cors =  require('cors');
require('dotenv').config();
const db = require('./models');

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'], 
  allowedHeaders: ['Content-Type', 'Authorization']
}
app.use((req, res, next) => {
  console.log(`REQUEST RECEIVED: ${req.method} ${req.path}`);
  next(); 
});



app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log('REQUEST GOT PAST CORS');
  next();
});

app.use(express.json());


// app.use((err, req, res, next) => {
//   if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
//     console.error('BAD JSON:', err.message);
//     return res.status(400).json({ msg: 'Invalid JSON payload sent.' });
//   }
//   next();
// });

app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5001;

db.sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
}).catch(err => {
    console.error('Failed to sync db: '+err.message);
});