const sql = require('../../../database/connection.js');

const deleteUser = (req, res) => {
  const { id } = req.params;

  sql.execute(`DELETE FROM users WHERE id = ${id}`, (err, result) => {
    if (err) {
      res.json({ msg: 'Query error', err });
    } else {
      if (result.affectedRows === 1) {
        res.json({ msg: 'User deleted', result });
      } else {
        res.json({ msg: 'User not found' });
      }
    }
  });
};

module.exports = { deleteUser };
