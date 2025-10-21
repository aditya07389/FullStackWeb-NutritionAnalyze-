const express=require('express');
const router=express.Router();
const passport=require('passport');
const profileController=require('../controllers/ProfileController');


const authCheck=passport.authenticate('jwt',{session:false});

router.get('/me',authCheck,profileController.getProfile);
router.put('/update',authCheck,profileController.updateProfile);

module.exports=router;