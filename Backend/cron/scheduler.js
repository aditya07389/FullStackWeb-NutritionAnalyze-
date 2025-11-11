const cron=require('node-cron');
const {User,Notification}=require('../models');
const {Op}=require('sequelize');

const startScheduler=(io,userSocketMap)=>{
    cron.schedule('0 */5 * * *', async () => {
        console.log('🔔 Cron Job Running: Sending health reminder every 5 hours...');
        try{
            const users=await User.findAll({attributes:['id']});
            for(const user of users){
                const newNotification=await Notification.create({
                    userId:user.id,
                    message:"Time for your 5-hour health check",
                    link:'/health-check'
                });
                const userSocketId=userSocketMap.get(user.id.toString());
                if(userSocketId){
                    io.to(userSocketId).emit('receiveNotification',newNotification);
                    console.log(`🚀 Sent LIVE notification to UserId: ${user.id}`);
                }
            }

        }catch(err){
            console.error('Cran job error:',err.message);
        }
      });
    };
module.exports={startScheduler};
