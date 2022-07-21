const { DataTypes } = require('sequelize');
const { dbSequelize } = require('../connection.js');

const blogModel = dbSequelize.define('blog', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
  content: {
    type: DataTypes.STRING(500), // VARCHAR(500) default is 255
    allowNull: false,
    require: true,
  },
});

module.exports = blogModel;
