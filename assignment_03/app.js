const express = require('express');
const { createTables } = require('./DB/models.js');

// Routers
const commentRouter = require('./modules/comment/comment_router.js');
const productRouter = require('./modules/product/product_router.js');
const userRouter = require('./modules/user/user_router.js');

const app = express();
const port = 3000 || 5000;

// createTables(); // uncomment to create tables

app.use(express.json());
app.use(userRouter, productRouter, commentRouter);

app.get('*', (req, res) => {
  res.send('<h1>404 Page not found</h1>');
});

app.listen(port, () => {
  console.log('Server is running on port 3000');
});

/**
TODO
Assignment 3:
** for user apis :
- Get all users ( with their products )
** for prodcut
- Get all products with their users informations
- Get all products with price between 1000 and 3000
 */
