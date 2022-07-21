const { Sequelize } = require('sequelize');

// orm = object relational mapper
const sequelizeConnection = new Sequelize('assignment_03', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelizeConnection;
