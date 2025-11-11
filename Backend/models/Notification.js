const { Sequelize } = require("sequelize");
module.exports=(sequelize,DataTypes)=>{
    const Notification=sequelize.define('Notification',{
        message:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        isRead:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
            defaultValue:false,
        },
        link:{
            type:DataTypes.STRING,
            allowNull:true,

        },
    });
return Notification;
};