const Sequelize = require('sequelize');
const config = require('../../config/environments');

//parameter = db, id, pw
const sequelize = new Sequelize(config.mysql.database, config.mysql.username, config.mysql.password,{
    host: config.mysql.host,
    dialect: 'mysql',
    timezone: '+09:00',
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: false
    },
    logging:false
});

module.exports = sequelize;
