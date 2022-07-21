const sql = require('../../../database/connection.js');

const signup = (req, res) => {
  const { name, email, password, cPassword } = req.body;

  if (password === cPassword) {
    sql.execute(
      `select email from users where email = '${email}'`,
      (err, result) => {
        if (err) {
          res.json({ msg: 'Query error', err });
        } else {
          if (result.length) {
            res.json({ msg: 'Email already exists' });
          } else {
            sql.execute(
              `insert into users (name, email, password) values ('${name}', '${email}', '${password}')`,
              (err, result) => {
                if (err) {
                  res.json({ msg: 'Query error', err });
                } else {
                  res.json({ msg: 'User created', result });
                }
              },
            );
          }
        }
      },
    );
  } else {
    res.json({ msg: 'Passwords do not match' });
  }
};

module.exports = { signup };
