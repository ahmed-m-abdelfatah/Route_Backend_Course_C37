const mysql2 = require('mysql2');

const sql = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'session_04',
});

module.exports = sql;
