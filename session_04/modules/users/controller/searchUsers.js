const sql = require('../../../database/connection.js');

const searchUsers = (req, res) => {
  const { name } = req.query;

  sql.execute(
    `SELECT * FROM users WHERE name LIKE '%${name}%'`,
    (err, result) => {
      if (err) {
        res.json({ msg: 'Query error', err });
      } else {
        res.json({ msg: 'Users found', result });
      }
    },
  );
};

module.exports = { searchUsers };
