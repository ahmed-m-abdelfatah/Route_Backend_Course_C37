const userModel = require('../../DB/model/user_model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const internalServerError = require('../../server_error.js');

const signup = async (req, res) => {
  try {
    const { email } = req.body;
    const findUser = await userModel.findOne({ email });

    if (findUser) {
      return res.status(409).json({
        message: 'Email already exists',
      }); // 409: Conflict
    }

    const newUser = new userModel(req.body);
    const saveUser = await newUser.save();

    res.status(200).json({
      message: 'User created successfully',
      data: saveUser,
    });
  } catch (error) {
    internalServerError(res, error);
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await userModel.findOne({ email }).select('password');

    if (!findUser) {
      return res.status(401).json({
        message: 'Invalid email or password',
      }); // 401: Unauthorized
    }

    const isMatch = await bcrypt.compare(password, findUser.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      }); // 401: Unauthorized
    }

    const token = jwt.sign(
      { id: findUser._id, isSignedIn: true },
      process.env.JWT_SECRET_KEY /* , { expiresIn: '1h' } */,
    );

    res.status(200).json({
      message: 'User logged in successfully',
      token,
    });
  } catch (error) {
    internalServerError(res, error);
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.user;

    const updatedUser = await userModel
      .findByIdAndUpdate(id, req.body, { new: true })
      .select('-password -_id -createdAt -updatedAt'); // new: true returns the updated document

    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    internalServerError(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.user;

    const deletedUser = await userModel.findByIdAndDelete(id).select('-password -__v -_id -createdAt -updatedAt');

    res.status(200).json({
      message: 'User deleted successfully',
      data: deletedUser,
    });
  } catch (error) {
    internalServerError(res, error);
  }
};

const displayAllUsers = async (req, res) => {
  /**
   * Get data from more than one collection and display it in one page
   * populate({ path: 'products', select: '-createdAt -updatedAt -__v -createdBy' })
   * aggregate([{$lookup: {from: 'products', localField: '_id', foreignField: 'createdBy', as: 'products'}}])
   */

  try {
    const allUsers = await userModel
      .find()
      .populate({ path: 'products', select: '-createdAt -updatedAt -__v -createdBy' })
      .select('-password -__v -createdAt -updatedAt -emailConfirmed');

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
  } catch (error) {
    internalServerError(res, error);
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await userModel
      .findById(id)
      .select('-password -__v -_id -createdAt -updatedAt -emailConfirmed -products');

    if (user) {
      res.status(200).json({
        message: 'User found',
        data: user,
      });
    } else {
      res.status(400).json({
        message: 'User not found',
      });
    }
  } catch (error) {
    internalServerError(res, error);
  }
};

module.exports = { signup, signin, update, displayAllUsers, deleteUser, getUserById };
