const express=require('express');
const router=express.Router();
const passport=require('passport');
const profileController=require('../controllers/ProfileController');


const authCheck=passport.authenticate('jwt',{session:false});

// Test route without auth
router.get('/test', (req, res) => {
  res.json({ message: 'Profile routes are working!' });
});

router.get('/me',authCheck,profileController.getProfile);
router.post('/update',authCheck,profileController.updateProfile);

module.exports=router;