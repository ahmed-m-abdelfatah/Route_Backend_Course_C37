require('dotenv').config();
const connectDB = require('./DB/connect_db.js');
const express = require('express');
const productRouter = require('./modules/product/product_router.js');
const userRouter = require('./modules/user/user_router.js');

const app = express();

app.use(express.json());
app.use(userRouter, productRouter);

connectDB();

app.listen(process.env.EXPRESS_PORT, () => {
  console.log('running......', process.env.EXPRESS_PORT);
});

/**
TODO Assignment 5:

Using mongoDB and exrpess

**Product module APIs :
- Get all products created yesterday using moment method = not sure of this solution

***Search points :
  3- decrypt by cryptojs = not used
 */
