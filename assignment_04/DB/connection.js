const mongoose = require('mongoose');

const connectDB = () => {
  return mongoose
    .connect('mongodb://localhost:27017/assignment_04')
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = connectDB;
