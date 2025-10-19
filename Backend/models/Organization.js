const { Sequelize } = require("sequelize");

module.exports = (sequelize,DataTypes) => {
    const Organization = sequelize.define('Organization',{
        name:{
            type : DataTypes.STRING,
            allowNull : false,
        },
    });
    return Organization;
};