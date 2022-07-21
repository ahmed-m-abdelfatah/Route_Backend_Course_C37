const mongoose = require('mongoose');

const connectDB = () => {
  return mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = connectDB;
