const sql = require('../database/connection.js');
const {
  searchEmailQuery,
  insertUserQuery,
  getUserSignQuery,
  updateUserQuery,
  searchIdQuery,
  deleteUserQuery,
  getAllUsersQuery,
  getAllUsersWithQueryParamsStartsWith,
  getAllUsersWithQueryParamsEndsWith,
  getAllUsersWithAgeBetweenQuery,
  getAllUsersWithNameStartWithAAndAgeLessThan30Query,
} = require('./users.query.js');

// add user(signUp)
function userSignup(req, res) {
  const {
    userName,
    userAge,
    userPhone,
    userEmail,
    userPassword,
    userConformationPassword,
  } = req.body;

  // Check if password and conformation password are the same
  if (userPassword !== userConformationPassword) {
    return res.status(400).json({
      message: 'Password and Conformation Password do not match',
    });
  }

  // Check if userEmail already exists
  sql.query(searchEmailQuery, [userEmail], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Internal Server Error',
        err: err.message,
      });
    }

    if (result.length > 0) {
      return res.status(400).json({
        message: 'Email already exists',
      });
    }

    // Insert user into database
    sql.query(
      insertUserQuery,
      [userName, userAge, userPhone, userEmail, userPassword],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error',
            err: err.message,
          });
        }

        return res.status(201).json({
          message: 'User created successfully',
        });
      },
    );
  });
}

// sign In
function userSignin(req, res) {
  const { userEmail, userPassword } = req.body;

  // Check if userEmail already exists
  sql.query(getUserSignQuery, [userEmail, userPassword], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Internal Server Error',
        err: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(400).json({
        message: 'Email or Password is incorrect',
      });
    }

    return res.status(200).json({
      message: 'User signed in successfully',
      user: result[0],
    });
  });
}

// Update user
function userUpdate(req, res) {
  const { id } = req.params;
  const { userName, userAge, userPhone } = req.body;

  // Check if userId exists
  sql.execute(searchIdQuery, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Internal Server Error',
        err: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(400).json({
        message: 'User not found',
      });
    }

    // Update user in database
    const { userEmail, userPassword } = result[0];

    sql.execute(
      updateUserQuery,
      [userName, userAge, userPhone, userEmail, userPassword, id],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error',
            err: err.message,
          });
        }

        return res.status(200).json({
          message: 'User updated successfully',
        });
      },
    );
  });
}

// Delete user
function userDelete(req, res) {
  const { id } = req.params;

  // Check if userId exists
  sql.execute(searchIdQuery, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Internal Server Error',
        err: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(400).json({
        message: 'User not found',
      });
    }

    // Delete user from database
    sql.execute(deleteUserQuery, [id], (err, result) => {
      if (err) {
        return res.status(500).json({
          message: 'Internal Server Error',
          err: err.message,
        });
      }

      return res.status(200).json({
        message: 'User deleted successfully',
      });
    });
  });
}

// Get all users
function getAllUsers(req, res) {
  sql.query(getAllUsersQuery, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Internal Server Error',
        err: err.message,
      });
    }

    return res.status(200).json({
      message: 'Users fetched successfully',
      numberOfUsers: result.length,
      users: result,
    });
  });
}

// Get all users with name start with(a)
// Get all users with name end with(a)
function getAllUsersWithQueryParams(req, res) {
  const { searchType, name } = req.query;
  console.log('~ req.query', req.query);

  if (!name.length && !searchType.length) {
    return res.status(400).json({
      message:
        'you need to provide name and searchType=start or searchType=end in query params',
    });
  }

  console.log('Start fetching data');

  switch (searchType) {
    case 'start': {
      sql.execute(getAllUsersWithQueryParamsStartsWith(name), (err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error',
            err: err.message,
          });
        }

        return res.status(200).json({
          message: 'Users fetched successfully',
          numberOfUsers: result.length,
          users: result,
        });
      });
      break;
    }

    case 'end': {
      sql.execute(getAllUsersWithQueryParamsEndsWith(name), (err, result) => {
        if (err) {
          return res.status(500).json({
            message: 'Internal Server Error',
            err: err.message,
          });
        }

        return res.status(200).json({
          message: 'Users fetched successfully',
          numberOfUsers: result.length,
          users: result,
        });
      });
      break;
    }

    default: {
      return res.status(400).json({
        message: 'Search type is invalid',
      });
    }
  }
}

// Get user by id
function getUserById(req, res) {
  const { id } = req.query;

  if (!id.length) {
    return res.status(400).json({
      message: 'You need to provide id in query params',
    });
  }

  // Check if userId exists
  sql.execute(searchIdQuery, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Internal Server Error',
        err: err.message,
      });
    }

    if (result.length === 0) {
      return res.status(400).json({
        message: 'User not found',
      });
    }

    return res.status(200).json({
      message: 'User fetched successfully',
      user: result[0],
    });
  });
}

// Get all users with age between 20 and 40
function getAllUsersWithAgeBetween(req, res) {
  const { age1, age2 } = req.query;

  if (!age1.length || !age2.length) {
    return res.status(400).json({
      message: 'You need to provide age1 and age2 in query params',
    });
  }

  sql.execute(getAllUsersWithAgeBetweenQuery(age1, age2), (err, result) => {
    if (err) {
      return res.status(500).json({
        message: 'Internal Server Error',
        err: err.message,
      });
    }

    return res.status(200).json({
      message: 'Users fetched successfully',
      numberOfUsers: result.length,
      users: result,
    });
  });
}

// Get all users with name start with A and age less than 30
function getAllUsersWithNameStartWithAAndAgeLessThan30(req, res) {
  const { nameStartWith, ageLessThan } = req.query;

  if (!nameStartWith.length || !ageLessThan) {
    return res.status(400).json({
      message:
        'You need to provide nameStartWith and ageLessThan in query params',
    });
  }

  sql.execute(
    getAllUsersWithNameStartWithAAndAgeLessThan30Query(
      nameStartWith,
      ageLessThan,
    ),
    (err, result) => {
      if (err) {
        return res.status(500).json({
          message: 'Internal Server Error',
          err: err.message,
        });
      }

      return res.status(200).json({
        message: 'Users fetched successfully',
        numberOfUsers: result.length,
        users: result,
      });
    },
  );
}

module.exports = {
  userSignup,
  userSignin,
  userUpdate,
  userDelete,
  getAllUsers,
  getAllUsersWithQueryParams,
  getUserById,
  getAllUsersWithAgeBetween,
  getAllUsersWithNameStartWithAAndAgeLessThan30,
};
