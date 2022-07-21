const express = require('express');
const connectDB = require('./DB/connection.js');
const productRouter = require('./modules/product/product_router.js');
const userRouter = require('./modules/user/user_router.js');

const app = express();
const port = 3000;

app.use(express.json());
app.use(userRouter, productRouter);

connectDB();

app.listen(port, () => {
  console.log('running......');
});
