const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');


router.use((req, res, next) => {
  console.log('REQUEST REACHED /api/auth ROUTER');
  next();
});

router.post('/register', authController.register);

router.post('/login',authController.login);

module.exports = router;