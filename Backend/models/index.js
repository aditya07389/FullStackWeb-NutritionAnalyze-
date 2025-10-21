const {Sequelize, DataTypes} = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(process.env.DATABASE_URL,{
    dialect: 'postgres', 
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./User.js')(sequelize, DataTypes);
db.Organization = require('./Organization.js')(sequelize, DataTypes);
db.Profile=require('./Profile.js')(sequelize,DataTypes);


db.User.hasOne(db.Organization,{foreignKey : 'adminID'});
db.Organization.belongsTo(db.User,{foreignKey : 'adminID'});

db.User.hasOne(db.Profile,{
    foreignKey:'userId',
    onDelete:'CASCADE'

});

db.Profile.belongsTo(db.User,{
    foreignKey:'userId'
});

module.exports = db;