const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server-express');
const userModel = require('../DB/model/user_model.js');

const roles = {
  user: 'user',
  admin: 'admin',
};

const authQL = async (BearerToken, accessRoles) => {
  try {
    if (!BearerToken) {
      throw new UserInputError('No token provided');
    }

    const token = BearerToken.split(`${process.env.BEARER_SECRETE} `)[1];

    if (!token) {
      throw new UserInputError('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded || !decoded.id) {
      throw new UserInputError('un-authenticated User');
    }

    const user = await userModel.findOne({ _id: decoded.id }).select('-password');

    if (!user) {
      throw new UserInputError('Invalid token');
    }

    if (!accessRoles.includes(user.role)) {
      throw new UserInputError('un-authorized user');
    }

    return user;
  } catch (error) {
    throw new UserInputError('Invalid token');
  }
};

module.exports = {
  authQL,
  roles,
};
