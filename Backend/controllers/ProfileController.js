const {User,Profile}=require('../models');
const {Sequelize}=require('sequelize');

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
    try{
        const userId=req.user.id;

        if(!userId){
            return res.status(401).json({msg:'Unauthorized, No user found'});
        }
        const {gender,age,allergies,medicalConditions,preferences}=req.body;

        const [profile,created]=await Profile.findOrCreate({
           where:{userId:userId},
           defaults:{
            userId:userId,
            gender,
            age,
            allergies,
            medicalConditions,
            preferences
           } 
        });

        if(!created){
            await profile.update({
                gender,
                age,
                allergies,
                medicalConditions,
                preferences
            });
        }
        res.status(200).json({msg:'Profile updated successfully'});

    }
    catch(err)
    {
        if(err instanceof Sequelize.ValidationError){
            const errors=err.errors.map(e=>({field:e.path,message:e.message}));
            return res.status(400).json({msg:'Validation error',errors});
        }

        console.error('Error in updateProfile',err.message);
        res.status(500).send('Server Error');
    }
};