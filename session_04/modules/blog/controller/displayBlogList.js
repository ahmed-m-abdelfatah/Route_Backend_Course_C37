const sql = require('../../../database/connection.js');

const displayBlogList = (req, res) => {
  sql.execute(
    `SELECT blog.id as B_ID , blog.date as B_DATE , blog.title as B_TITLE , blog.description as B_DESCRIPTION , users.id as U_ID , users.name as U_NAME , users.email as U_EMAIL FROM blog INNER JOIN users ON blog.userId = users.id`,
    (err, result) => {
      if (err) {
        res.json({ message: 'Query error', error: err });
      } else {
        res.json({ message: 'Blog list', result });
      }
    },
  );
};

module.exports = { displayBlogList };
