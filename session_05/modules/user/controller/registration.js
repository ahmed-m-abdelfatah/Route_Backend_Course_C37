const userModel = require('../../../DB/model/userModel.js');

const userSignup = (req, res) => {
  const { email, password, confirmationPassword, name, phone } = req.body;

  if (password !== confirmationPassword) {
    return res.status(400).json({
      message: 'Passwords do not match',
    });
  }

  // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findone
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

      // https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#simple-insert-queries
      userModel
        .create({
          email,
          password,
          name,
          phone,
        })
        .then(user => {
          res.status(201).json({
            message: 'User created successfully',
            user: {
              email: user.email,
              name: user.name,
              phone: user.phone,
            },
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
      where: {
        email,
        password,
      },
    });

    if (!findUser) {
      return res.status(400).json({
        message: 'Invalid email or password',
      });
    }

    return res.status(200).json({
      message: 'User logged in successfully',
      user: {
        email: findUser.email,
        name: findUser.name,
        phone: findUser.phone,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error,
    });
  }
};

module.exports = {
  userSignup,
  userSignin,
};
