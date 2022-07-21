const express = require('express');
const { drawTables } = require('./DB/connection.js');
const { userRouter, blogRouter } = require('./modules/index.router.js');

const app = express();
const port = 3000 || 5000;

// drawTables(); // uncomment to create tables

app.use(express.json());
app.use(userRouter, blogRouter);

app.get('*', (req, res) => {
  res.send('<h1>404 Page not found</h1>');
});

app.listen(port, () => {
  console.log('Server is running on port 3000');
});
