const sql = require('../../../database/connection.js');

const update = (req, res) => {
  const { id } = req.params;
  const { phone } = req.body;

  sql.execute(
    ` update users set phone = '${phone}' where id = ${id}`,
    (err, result) => {
      if (err) {
        res.json({ msg: 'Query error', err });
      } else {
        console.log(result);
        if (result.affectedRows === 1) {
          res.json({ msg: 'User updated', result });
        } else {
          res.json({ msg: 'User not found' });
        }
      }
    },
  );
};

module.exports = { update };
