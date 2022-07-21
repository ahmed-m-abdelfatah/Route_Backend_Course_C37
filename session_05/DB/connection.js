const { Sequelize } = require('sequelize');

// orm = object relational mapper
const dbSequelize = new Sequelize('session_05', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const drawTables = () => {
  // alter to edit table columns
  return dbSequelize
    .sync({ alter: true })
    .then(result => {
      // console.log('DB connected', result);
      console.log('DB connected');
    })
    .catch(err => {
      console.log('DB connection error', err);
    });
};

module.exports = {
  dbSequelize,
  drawTables,
};
