const express = require('express');
const connectDB = require('./DB/connection.js');
const { userRouter, blogRouter } = require('./modules/index.router');
const app = express();
const port = 3000;
app.use(express.json());
app.use(userRouter, blogRouter);

connectDB();

app.listen(port, () => {
  console.log('running......');
});
