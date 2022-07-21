const mongoose = require('mongoose');

const connectDB = async () => {
  return mongoose
    .connect('mongodb://localhost:27017/session_07')
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = connectDB;
