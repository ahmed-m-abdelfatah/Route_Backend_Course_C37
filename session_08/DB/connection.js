const mongoose = require('mongoose');

const connectDB = () => {
  return mongoose
    .connect('mongodb://localhost:27017/session_08')
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = connectDB;
