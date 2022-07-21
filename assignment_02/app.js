const express = require('express');
const { addDummyDataToDB, clearAllUsers } = require('./test/addDummyData.js');
const usersRouter = require('./userModule/users.router.js');

const app = express();
const port = 3000 || 5000;

// middleware
app.use(express.json());
app.use(usersRouter);

// For test only
addDummyDataToDB();
// clearAllUsers();

// 404
app.get('*', (req, res) => {
  res.json({ message: '404 Page not found' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
