const {Sequelize}=require("sequelize")

module.exports=(sequelize,DataTypes)=>{
    const Profile=sequelize.define('Profile',{

        gender:{
            type: DataTypes.ENUM('male','female','other'),
            allowNull: true
        },

        age:{
            type: DataTypes.INTEGER,
            allowNull: true,
            validate:{
                min: 0,
                max: 100
            }
        },

        allergies:{
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            defaultValue: []
        },

        medicalConditions:{
            type : DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            defaultValue: []
        },

        preferences:{
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false,
            defaultValue: []
        }




});
return Profile;
}