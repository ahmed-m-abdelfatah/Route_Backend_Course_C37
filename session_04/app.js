const express = require('express');
const app = express();
const port = 3000;
const { userRouter, blogRouter } = require('./routes/allRoutes.js');

app.use(express.json());
app.use(userRouter, blogRouter);

app.get('*', (req, res) => {
  res.send('<h1>404 Page not found</h1>');
});

app.listen(port, () => {
  console.log('Server is running on port 3000');
});
