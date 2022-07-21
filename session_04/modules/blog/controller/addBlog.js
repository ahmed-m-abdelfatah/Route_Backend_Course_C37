const sql = require('../../../database/connection.js');

const addBlog = (req, res) => {
  const { title, description, userId } = req.body;

  sql.execute(
    `INSERT INTO blog (title, description, userId) VALUES ('${title}', '${description}', ${userId})`,
    (err, result) => {
      if (err) {
        res.json({ message: 'Query error', error: err });
      } else {
        res.json({ message: 'Blog added', result });
      }
    },
  );
};

module.exports = { addBlog };
