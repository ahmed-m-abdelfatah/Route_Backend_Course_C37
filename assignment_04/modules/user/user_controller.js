const userModel = require('../../DB/model/user_model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// .env
require('dotenv').config();
const jwtSecreteKey = process.env.JWT_SECRET_KEY;
// console.log('~ jwtSecreteKey', jwtSecreteKey);

const signup = async (req, res) => {
  try {
    const { email, password, cPassword, ...rest } = req.body;
    if (password === cPassword) {
      const findUser = await userModel.findOne({ email });

      if (findUser) {
        res.json({
          message: 'Email already exists',
        });
      } else {
        const hashPassword = await bcrypt.hash(password, 8);

        const newUser = new userModel({
          ...rest,
          email,
          password: hashPassword,
        });

        const saveUser = await newUser.save();

        res.json({
          message: 'User created successfully',
          data: saveUser,
        });
      }
    } else {
      res.json({
        message: 'Password and confirm password does not match',
      });
    }
  } catch (error) {
    res.json({
      message: 'Something went wrong',
      error,
    });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await userModel.findOne({ email }).select('password');
    if (findUser) {
      const isMatch = await bcrypt.compare(password, findUser.password);

      if (isMatch) {
        const token = jwt.sign({ id: findUser._id, isSignin: true }, jwtSecreteKey /* , { expiresIn: '1h' } */);

        res.json({
          message: 'User logged in successfully',
          token,
        });
      } else {
        res.json({
          message: 'Invalid email or password',
        });
      }
    } else {
      res.json({
        message: 'Invalid email or password',
      });
    }
  } catch (error) {
    res.json({
      message: 'Something went wrong',
      error,
    });
  }
};

const update = async (req, res) => {
  const { id } = req.user;

  const updatedUser = await userModel
    .findByIdAndUpdate(id, req.body, { new: true })
    .select('-password -__v -_id -createdAt -updatedAt'); // new: true returns the updated document

  res.json({
    message: 'User updated successfully',
    data: updatedUser,
  });
};

const displayAllUsers = async (req, res) => {
  const allUsers = await userModel.find().select('-password -__v -_id -createdAt -updatedAt');

  if (allUsers) {
    res.json({
      message: 'All users',
      numberOfUsers: allUsers.length,
      data: allUsers,
    });
  } else {
    res.json({
      message: 'No users found',
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.user;

  const deletedUser = await userModel.findByIdAndDelete(id).select('-password -__v -_id -createdAt -updatedAt');

  res.json({
    message: 'User updated successfully',
    data: deletedUser,
  });
};

const userProfile = async (req, res) => {
  const user = req.user;

  res.json({
    message: 'User profile',
    user,
  });
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  const user = await userModel.findById(id).select('-password -__v -_id -createdAt -updatedAt');

  if (user) {
    res.json({
      message: 'User found',
      data: user,
    });
  } else {
    res.json({
      message: 'User not found',
    });
  }
};

const softDeleteUser = async (req, res) => {
  const { id } = req.params;

  const isUserSoftDeletedAlready = await userModel.findById(id).select('softDelete');

  if (isUserSoftDeletedAlready === null || !isUserSoftDeletedAlready) {
    return res.json({
      message: 'User not found',
    });
  }

  if (isUserSoftDeletedAlready.softDelete) {
    res.json({
      message: 'User already soft deleted',
    });
  } else {
    const softDeletedUser = await userModel
      .findByIdAndUpdate(id, { softDelete: true }, { new: true })
      .select('-password -__v -_id -createdAt -updatedAt');

    res.json({
      message: 'User deleted successfully',
      data: softDeletedUser,
    });
  }
};

module.exports = { signup, signin, update, displayAllUsers, deleteUser, userProfile, getUserById, softDeleteUser };
