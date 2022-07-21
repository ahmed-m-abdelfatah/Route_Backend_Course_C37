require('dotenv').config();
const express = require('express');
const appRoutes = require('./routes/app_routes.js');
const graphqlRoutes = require('./routes/app_routes_ql.js');
const connectDB = require('./DB/connect_db.js');

const port = process.env.PORT;
const app = express();

appRoutes(app);
graphqlRoutes(app);

const localDB = process.env.DB_LOCAL_URI;
connectDB(localDB);

app.listen(port, () => {
  console.log('running......', port);
});

/**
Final Assignment💚:
Using grahpql and mongodb create two collections User model and blog model:
[X] User model :
- name
- Email
- Password
- Blogs ( array of objectIds)
[X] Blog model:
- title
- Desc
- Price
- Picture( array )
Auth APIs:
- [X] signup (confirm email,hash password)
- [X] Sign in
- [X] Forget password ( hash new password )
User APIs:
- [X] get profile( not include password)
- [X] Update profile( not include password)
- [X] Update password ( hash new password )
- [X] Delete user by account owner or admin
- [X] Get all users with their blog info
Blog APIs:
- [X] Add blog
- [X] Delete blog by admin and blog owner
- [X] Update blog by blog owner only
- [X] Add picture of blog ( more than one stored in array  are accpeted )
Notes:
- [X] apply joi validation for each api require data entry from use

الديدلاين يوم الخميس الساعه ١٠ بليل💚
 */
