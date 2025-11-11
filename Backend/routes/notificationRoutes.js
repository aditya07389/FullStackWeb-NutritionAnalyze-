const express=require('express')
const router=express.Router();
const passport=require('passport');

const notificationController=require('../controllers/notificationController');

const authMiddleware=passport.authenticate('jwt',{session:false});

//define the api routes

router.get('/',authMiddleware,notificationController.getNotifications);

router.get('/unread-count',authMiddleware,notificationController.getUnreadCount);

router.patch('/:id/read',authMiddleware,notificationController.markAsRead);

router.patch('/readall',authMiddleware,notificationController.markAllAsRead);

module.exports=router;