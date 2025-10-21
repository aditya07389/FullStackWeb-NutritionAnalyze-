const {User,Profile}=require('../models');

//get data from the database
exports.getProfile=async(req,res)=>{
    try{
        const user=await User.findByPk(req.user.id,{
            include:{
                model:Profile,
                attributes:['healthConditions'],
            },
        });

        if(!user)
        {
            return res.status(404).json({error:"User not found"});
        }

        res.json({
            username:user.username,
            credits:user.credits,
            healthConditions:user.Profile?.healthConditions || [],
        });

    }

    catch(error){
        console.error("Error fetching profile:",error);
        res.status(500).json({error:"Server error"});
    }
};


//updating the data 
exports.updateProfile=async(req,res)=>{
    const {healthConditions}=req.body;

    try{
        // Find existing profile or create a new one
        let profile=await Profile.findOne({where:{userId:req.user.id}});

        if(!profile){
            // Create a new profile if it doesn't exist
            profile = await Profile.create({
                userId: req.user.id,
                healthConditions: healthConditions || []
            });
        } else {
            // Update existing profile
            profile.healthConditions=healthConditions;
            await profile.save();
        }

        res.json(profile);

    }
    catch(error){
        console.error("Error updating profile:",error);
        res.status(500).json({error:"Server error"});
    }
};