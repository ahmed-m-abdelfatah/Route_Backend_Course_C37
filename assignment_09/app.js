require('dotenv').config();
const path = require('path');
const express = require('express');
const connectDB = require('./DB/connect_db.js');
const indexRouter = require('./modules/index_router.js');

const port = process.env.EXPRESS_PORT;
const app = express();
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, './uploads')));
app.use(process.env.CHANNEL + '/auth', indexRouter.authRouter);
app.use(process.env.CHANNEL + '/user', indexRouter.userRouter);
app.use(process.env.CHANNEL + '/post', indexRouter.postRouter);
app.use(process.env.CHANNEL + '/comment', indexRouter.commentRouter);
app.use(process.env.CHANNEL + '/admin', indexRouter.administrationRouter);

connectDB();
app.listen(port, () => {
  console.log('running......', port);
});

/**
Assignment 9:
Create three collections :
User , post and comment collection
User APIs:
- [X] signup (confirm email)
- [X] Sign in ( must be confirmed )
- [X] Update password ( hash the new pass)
- [X] Forget password
- [X] Get all users with their posts info
Post APIs:
- [X] add post
- [X] Update post ( by post owner only)
- [X] Soft  delete post and delete it from posts array in user model ( by post owner only and admin )
- [X] Like post ( the post owner can’t like his post)
- [X] Un like post
- [X] Get all posts with their comments info -- in display profile api
Comment API:
- [X] add comment
- [X] Edit comment (by comment owner only)
- [X] Soft delete  comment and delete it from comments array in post model ( by comment owner only and admin)
- [X] Like comment (the comment owner can’t like his comment)
- [X] Add replay on comment
- [X] Add replay on replay
 */
