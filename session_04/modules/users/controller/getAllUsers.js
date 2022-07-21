const sql = require('../../../database/connection.js');

const getAllUsers = (req, res) => {
  sql.execute(`SELECT * FROM users`, (err, result) => {
    if (err) {
      res.json({ msg: 'Query error', err });
    } else {
      res.json({ msg: 'Users found', result });
    }
  });
};

module.exports = { getAllUsers };
