const { DataTypes } = require('sequelize'); // { DataTypes or Sequelize }
const { dbSequelize } = require('../connection.js');
const blogModel = require('./blogModel.js');

const userModel = dbSequelize.define('user', {
  email: {
    type: DataTypes.STRING(500), // VARCHAR(500) default is 255
    allowNull: false,
    require: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
});

userModel.hasMany(blogModel, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

blogModel.belongsTo(userModel);

module.exports = userModel;
