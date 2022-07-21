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
app.use(process.env.CHANNEL + '/admin', indexRouter.administrationRouter);

connectDB();
app.listen(port, () => {
  console.log('running......', port);
});

/**
Assginment 8 :
Using express and mongoose create
User model
Then apply these APIs:
- [X] sign up ( must confirm the email before store user in tha database , and redirect it to html page say welcom “email “  )
- [X] Sign in ( must check that the email had been confirmed , and that the user isnot blocked by admin , change the status of the user to online instead of offline  )
- [ ] Deactivate account ( by the account owner only )
- [X] Update profile ( if you update the email must confirm the new email first then apply the changes in database)
- [X] Block account ( by admin only )
- [X] Sign out ( when do sign out return  last seen of this account , change the status to offline instead of online )
- [ ] Admin send email for multiple users -- TOO EASY
- [ ] send any attachment to email -- TOO EASY

Bouns points :
- [X] Foregt password  api
- [ ] Node schedule
- [X] QR code
- [ ] Pagination
 */
