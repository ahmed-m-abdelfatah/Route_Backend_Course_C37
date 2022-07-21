require('dotenv').config();
const express = require('express');
const runningCors = require('./services/cors.js');
const runningRateLimit = require('./services/rate_limit.js');
const appRoutes = require('./app_routes.js');
const connectDB = require('./DB/connect_db.js');
const swaggerDocs = require('./swagger/swagger.js');
const socketInit = require('./services/socket_init.js');
const cornJobs = require('./services/cron_jobs.js');

const port = process.env.PORT;
const app = express();

runningCors(app);
runningRateLimit(app);
appRoutes(app);

const localDB = process.env.DB_LOCAL_URI;
const globalDB = process.env.DB_GLOBAL_URI;

// connectDB(localDB);
connectDB(globalDB);

const server = app.listen(port, () => {
  console.log('running......', port);

  /**
   // start swagger docs
   // NOTE
   * 1. don't make 2 end points end with the same name [add product = /add and add comment = /add] because the stupid converter will render the second one it should be [add product = product/add and add comment = comment/add]
   */
  require('./swagger/postman_to_swagger.js');
  swaggerDocs(app, ['./swagger/swagger.yaml']);
});

socketInit(server);
cornJobs();

/**
Final Exam:
The idea of this exam, website like Olx you can buy product and sell product and add products to his wishlist to buy it soon.

**create three collections
- [X] User collection:
- firstName
- lastName
- Email
- Password
- Profile_picture( allow more than one profile picture)
- Cover_pictures
- Qr_code
- Confirmed
- Blocked
- WishList ( array of objectIds)
- IsDeleted
- Blocked

- [X] Product collection:
- product_title
- Product_desc
- Product_price
- Likes( array of objectIds)
- CreatedBy ( ref to user model)
- Hidden
- IsDeleted
- Comments ( array of objectIds ref to comment collection ) ( do this field of you relate product collection to comment collection by parent-child relationship )
- Wishlists ( array of objectIds ref to user collection) ( to which user’s wishlist this product added )

- [X] Comment collection:
- comment_body
- comment_By
- Product_id
- Replies ( array of objectIds ref to comment collection. )

**In General :
- [X] Create pdf contain id,title,desc,price of every product created today and send this pdf ever day at 11:59:59 to the admin -- EVERY WORKING DAYS FROM SUNDAY TO THURSDAY

**User APIs :
- [X] SignUp ( confirm email  , hash password before save to database )
- [X] SignIn ( must check if this user’s email is confirmed , admin didn’t block him , user didn’t soft deleted )
- [X] Update profile ( by account owner only ) ( if email updated must confirm it , password update must hashed before save in database) -- UPDATED PASSWORD SHOULD BE IN ONE SEPARATE API BECAUSE THE REQUIRED FIELDS IN JOI VALIDATION
- [X] Delete user ( by admin and account owner )
- [X] Add profile picture
- [X] Add cover picture
- [X] Forget password
- [X] Soft delete ( by admin )
- [X] Get all users with their product information , each product with its comments information and  its wishlist array information , each comment with its replies if exist( apply pagination concept in this api )

**Product APIs:
- [X] Add product ( create QR code for each product,  if there is a product added,  it must reflected in all pages which open the same website in real time using sokect io )
- [X] Update product ( by product owner only )
- [X] Delete product ( by admin and product owner )
- [X] Soft delete ( by admin and product owner )
- [X] Like / unlike product
- [X] Add product to wishlist (this api will add the product to wishlist array in user collection  , if product already exists don’t add it again )
- [X] Hide product

**Comment APIs:
- [X] Add comment ( if there is a comment added, it must reflected in all pages which open the same wbsite in real time using sokect io )
- [X] Add reply in comment
- [X] Update comment ( by comment owner only )
- [X] Delete comment ( by comment owner and product owner )
- [X] Like/unlike comment


**Important notes:
- [X] apply joi validation at every api require data entry from user
- [X] After any update the version must increment by one
- [X] Must deploy your final exam on heroku
- [X] Do Documentation for APIs ( pouns 10 marks ) -- using swagger

===============================
طريقه التسليم:
كل واحد يسلم البروچيكت زى ما كنا بنسلم الاسايمنت
-الاسم ، بتحضر ف ميعاد ايه ، وان دا الامتحان
كل واحد يعمل export لل collection اللى هو اشتغل عليه وعمل جواه ال apis كلها ف البوست مان
===============================
وقت الامتحان:
الامتحان هينزل يوم الاتنين الساعه ٩ الصبح
والديدلاين هيكون يوم التلات اللى بعدو الساعه ٩ بليل 💚
 */
