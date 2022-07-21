const sql = require('../../../database/connection.js');

const signin = (eeq, res) => {
  const { email, password } = eeq.body;
  sql.execute(
    `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`,
    (err, result) => {
      if (err) {
        res.json({ msg: 'Query error', err });
      } else {
        console.log(result);

        if (result.length === 1) {
          res.json({ msg: 'User found', result });
        } else {
          res.json({ msg: "Email and password didn't match" });
        }
      }
    },
  );
};

module.exports = { signin };
