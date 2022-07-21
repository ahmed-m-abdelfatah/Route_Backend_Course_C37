const userModel = require('../../DB/model/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  const { name, email, password, cPassword, phone } = req.body;
  if (password === cPassword) {
    const findUser = await userModel.findOne({ email }).select('email -_id');

    if (findUser) {
      res.json({
        message: 'Email already exists',
      });
    } else {
      const hashPassword = await bcrypt.hash(password, 8);

      const newUser = new userModel({
        name,
        email,
        password: hashPassword,
        phone,
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
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const findUser = await userModel.findOne({ email }).select('password');
  const isMatch = await bcrypt.compare(password, findUser.password);

  if (isMatch) {
    const token = jwt.sign({ id: findUser._id, isSignin: true }, 'secretKey' /*, { expiresIn: '1h' } */);

    res.json({
      message: 'User logged in successfully',
      token,
    });
  } else {
    res.json({
      message: 'Invalid email or password',
    });
  }
};

const update = async (req, res) => {
  const { id } = req.params;
  const { name, phone } = req.body;

  const updateUser = await userModel.findByIdAndUpdate(id, { name, phone }, { new: true }).select('-password');

  if (updateUser) {
    res.json({
      message: 'User updated successfully',
      data: updateUser,
    });
  } else {
    res.json({
      message: 'User not found',
    });
  }
};

const displayAllUsers = async (req, res) => {
  const allUsers = await userModel.find().select('-password');

  if (allUsers) {
    res.json({
      message: 'All users',
      data: allUsers,
    });
  } else {
    res.json({
      message: 'No users found',
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  // const deleteUser = await userModel.findOneAndDelete({ _id: id });
  // const deleteUser = await userModel.deleteOne({ _id: id }); // deleteOne() is deprecated
  const deleteUser = await userModel.findByIdAndDelete(id);

  if (deleteUser) {
    res.json({
      message: 'User deleted successfully',
    });
  } else {
    res.json({
      message: 'User not found',
    });
  }
};

const userProfile = async (req, res) => {
  const user = req.user;

  res.json({
    message: 'User profile',
    user,
  });
};

module.exports = { signup, signin, update, displayAllUsers, deleteUser, userProfile };
