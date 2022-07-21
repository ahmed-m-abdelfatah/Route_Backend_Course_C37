const { Op } = require('sequelize');
const { userModel, productModel, commentModel } = require('../../DB/models.js');

const userSignup = (req, res) => {
  const { email, password, confirmationPassword } = req.body;

  if (password !== confirmationPassword) {
    return res.status(400).json({
      message: 'Passwords do not match',
    });
  }

  userModel
    .findOne({
      where: {
        email,
      },
    })
    .then(user => {
      if (user) {
        return res.status(400).json({
          message: 'User already exists',
        });
      }

      userModel
        .create(req.body)
        .then(result => {
          console.log('~ user', user);
          res.status(201).json({
            message: 'User created successfully',
            user: result,
          });
        })
        .catch(err => {
          res.status(500).json({
            message: 'Error creating user',
            err,
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Internal server error',
        err,
      });
    });
};

const userSignin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const findUser = await userModel.findOne({
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      where: {
        // email,
        // password,
        [Op.and]: {
          email,
          password,
        },
      },
    });

    if (!findUser) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }

    return res.status(200).json({
      message: 'User logged in successfully',
      user: findUser,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, firstName, lastName, age } = req.body;

    const findUser = await userModel.findOne({
      where: {
        id,
        email,
        password,
      },
    });

    if (!findUser) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    const updatedUser = await userModel.update(
      {
        firstName,
        lastName,
        age,
      },
      {
        where: {
          id,
        },
      },
    );

    return res.status(200).json({
      message: 'User updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const findUser = await userModel.findOne({
      where: {
        id,
      },
    });

    if (!findUser) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    const deletedUser = await userModel.destroy({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error,
    });
  }
};

// TODO
const displayAllUsers = async (req, res) => {
  const data = await userModel.findAll();

  return res.status(200).json({
    message: 'Users retrieved successfully',
    data,
  });
};

const displayAllUsersStartWithAAndAgeGreaterThan30 = async (req, res) => {
  const data = await userModel.findAll({
    where: {
      firstName: {
        [Op.like]: 'A%',
      },
      age: {
        [Op.gt]: 30,
      },
    },
  });

  return res.status(200).json({
    message: 'Users retrieved successfully',
    data,
  });
};

const displayAllWithFirstNameOrLastNameContainA = async (req, res) => {
  const data = await userModel.findAll({
    where: {
      [Op.or]: [
        {
          firstName: {
            [Op.like]: '%A%',
          },
        },
        {
          lastName: {
            [Op.like]: '%A%',
          },
        },
      ],
    },
  });

  return res.status(200).json({
    message: 'Users retrieved successfully',
    data,
  });
};

module.exports = {
  userSignup,
  userSignin,
  updateUser,
  deleteUser,
  displayAllUsers,
  displayAllUsersStartWithAAndAgeGreaterThan30,
  displayAllWithFirstNameOrLastNameContainA,
};
