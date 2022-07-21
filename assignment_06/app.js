require('dotenv').config();
const express = require('express');
const connectDB = require('./DB/connect_db.js');
const moduleRouters = require('./modules/index_router.js');

const port = process.env.EXPRESS_PORT;
const app = express();
app.use(express.json());

const channel = '/api/dev/v1';

app.use(channel + '/auth', moduleRouters.authRouter);
app.use(channel + '/user', moduleRouters.userRouter);
app.use(channel + '/message', moduleRouters.messageRouter);

connectDB();
app.listen(port, () => {
  console.log('running......', port);
});
