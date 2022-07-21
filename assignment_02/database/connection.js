const mysql2 = require('mysql2');

const connection = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'assignment_02',
});

module.exports = connection;
