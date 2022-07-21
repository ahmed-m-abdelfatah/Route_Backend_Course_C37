require('dotenv').config();
const path = require('path');
const express = require('express');
const connectDB = require('./DB/connect_db.js');
const indexRouter = require('./modules/index_router.js');

const port = process.env.EXPRESS_PORT;
const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

const channel = '/api/dev/v1';

app.use(channel + '/auth', indexRouter.authRouter);
app.use(channel + '/user', indexRouter.userRouter);
app.use(channel + '/message', indexRouter.messageRouter);

connectDB();
app.listen(port, () => {
  console.log('running......', port);
});

/**
TODO

Assginment 7 :
As the previous assignment( saraha assignment) but add new features as follows:

5- after delete any message , delete its id from its user message array  ( pull instead or push) in delete message api

**Search about child to parent relation ship
 */
