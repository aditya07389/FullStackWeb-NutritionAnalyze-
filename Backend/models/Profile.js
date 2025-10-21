const {Sequelize}=require("sequelize")

module.exports=(sequelize,DataTypes)=>{
    const Profile=sequelize.define('Profile',{
        healthConditions:{
            type:DataTypes.JSON,
            allowNull:true,
            defaultValue:[]
        }
});
return Profile;
}