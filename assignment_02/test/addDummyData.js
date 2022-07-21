const sql = require('../database/connection.js');
const {
  insertUserQuery,
  clearUsersTable,
  isThereDataQuery,
  resetIdToOne,
} = require('../userModule/users.query.js');
const data = require('./dummyData.js');

function addDummyDataToDB() {
  let isThereData = false;

  // https://stackoverflow.com/a/24248425/16107539
  // Check if there is no data
  sql.query(isThereDataQuery, (err, result) => {
    if (err) {
      return console.log(err.message);
    }

    console.log('~ result.length', result.length);

    if (result.length) {
      isThereData = true;
      console.log('~ result.length', result.length);
      return console.log('No need to add dummy data');
    }

    // Insert dummy data into database
    if (!isThereData) {
      data.forEach(
        ({ userName, userAge, userPhone, userEmail, userPassword }) => {
          sql.query(
            insertUserQuery,
            [userName, userAge, userPhone, userEmail, userPassword],
            (err, result) => {
              if (err) {
                return console.log(err.message);
              }

              return console.log('User created successfully');
            },
          );
        },
      );
    }
  });
}

function clearAllUsers() {
  sql.query(clearUsersTable, (err, result) => {
    if (err) {
      return console.log(err.message);
    }

    resetIds();
    return console.log('Users table cleared successfully');
  });
}

function resetIds() {
  // reset id to 1
  sql.query(resetIdToOne, (err, result) => {
    if (err) {
      return console.log(err.message);
    }

    return console.log('id reset to 1');
  });
}

module.exports = { addDummyDataToDB, clearAllUsers };
