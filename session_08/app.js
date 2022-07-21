const express = require('express');
const connectDB = require('./DB/connection.js');
const userRouter = require('./modules/user_router.js');
const app = express();
const port = 3000;

app.use(express.json());
app.use(userRouter);

connectDB();

app.listen(port, () => {
  console.log('running......');
});
