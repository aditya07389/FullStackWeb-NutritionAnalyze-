const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport=require('passport');


router.use((req, res, next) => {
  console.log('REQUEST REACHED /api/auth ROUTER');
  next();
});

router.post('/register', authController.register);

router.post('/login',authController.login);

router.get(
  '/google',
  passport.authenticate('google',{
    scope:['profile','email'],
    prompt:'select_account',
  })

);

router.get(
  '/google/callback',
  passport.authenticate('google',{
    session:false,
    failureRedirect:'http://localhost:5173/login',
  }),
  authController.googleCallback
);

module.exports = router;