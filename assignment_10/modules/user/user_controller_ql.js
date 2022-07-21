const { GraphQLString, GraphQLNonNull, GraphQLList } = require('graphql');
const userModel = require('../../DB/model/user_model.js');
const { userType } = require('./user_types_ql.js');
const { authQL, roles } = require('../../middleware/auth_ql.js');
const endPoint = require('./user_end_point.js');
const validationQL = require('../../middleware/validation_ql.js');
const validators = require('./user_validation_schema.js');
const { UserInputError } = require('apollo-server-errors');
const bcrypt = require('bcryptjs');
const sendEmail = require('../../services/email.js');

const getProfile = () => {
  const args = {
    token: { type: new GraphQLNonNull(GraphQLString) },
  };

  const resolve = async (parent, args) => {
    try {
      const { value, error } = validationQL(validators.getProfile, args);

      if (error && error.length > 0) {
        throw new UserInputError(error);
      }

      const user = await authQL(value.token, endPoint.getProfile);

      // add new propriety to user object
      user.message = 'success';

      return user;
    } catch (error) {
      throw new UserInputError(error);
    }
  };

  return {
    type: userType,
    args,
    resolve,
  };
};

const updateProfile = () => {
  const args = {
    token: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: new GraphQLNonNull(GraphQLString) },
  };

  const resolve = async (parent, args) => {
    try {
      const { value, error } = validationQL(validators.updateProfile, args);

      if (error && error.length > 0) {
        throw new UserInputError(error);
      }

      const user = await authQL(value.token, endPoint.updateProfile);

      const updatedUser = await userModel.findByIdAndUpdate(
        user._id,
        {
          name: value.name,
        },
        { new: true },
      );

      // add new propriety to user object
      updatedUser.message = 'success';

      return updatedUser;
    } catch (error) {
      throw new UserInputError(error);
    }
  };

  return {
    type: userType,
    args,
    resolve,
  };
};

const updatePassword = () => {
  const args = {
    token: { type: new GraphQLNonNull(GraphQLString) },
    oldPassword: { type: new GraphQLNonNull(GraphQLString) },
    newPassword: { type: new GraphQLNonNull(GraphQLString) },
    cNewPassword: { type: new GraphQLNonNull(GraphQLString) },
  };

  const resolve = async (parent, args) => {
    try {
      const { value, error } = validationQL(validators.updatePassword, args);

      if (error && error.length > 0) {
        throw new UserInputError(error);
      }

      const user = await authQL(value.token, endPoint.updatePassword);

      const updatedUserPassword = await userModel.findById(user.id).select('password __v');

      if (!bcrypt.compareSync(value.oldPassword, updatedUserPassword.password)) {
        throw new UserInputError('Old password is incorrect !');
      } else {
        updatedUserPassword.password = value.newPassword;
        updatedUserPassword.__v += 1;
        await updatedUserPassword.save();

        return 'success';
      }
    } catch (error) {
      throw new UserInputError(error);
    }
  };

  return {
    type: GraphQLString,
    args,
    resolve,
  };
};

const deleteProfile = () => {
  const args = {
    token: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: GraphQLString },
  };

  const resolve = async (parent, args) => {
    const { value, error } = validationQL(validators.deleteProfile, args);

    if (error && error.length > 0) {
      throw new UserInputError(error);
    }

    const user = await authQL(value.token, endPoint.deleteProfile);

    if (user.role === roles.admin) {
      const deletedUser = await userModel.findByIdAndDelete(value.id);
      sendEmail(deletedUser.email, 'DELETED', `<h1>${user.role} deleted your account for real</h1>`);
      return 'Done, an admin deleted user';
    }

    await userModel.findByIdAndDelete(user._id);
    return 'Done, the user was honestly deleted';
  };

  return {
    type: GraphQLString,
    args,
    resolve,
  };
};

const getAllUsers = () => {
  const args = {
    token: { type: new GraphQLNonNull(GraphQLString) },
  };

  const resolve = async (parent, args) => {
    const { value, error } = validationQL(validators.getAllUsers, args);

    if (error && error.length > 0) {
      throw new UserInputError(error);
    }

    const user = await authQL(value.token, endPoint.getAllUsers);

    if (user.role === roles.admin) {
      const users = await userModel.find({}).populate({
        path: 'blogs',
      });
      return users;
    }

    throw new UserInputError('You are not an admin');
  };

  return {
    type: new GraphQLList(userType),
    args,
    resolve,
  };
};

module.exports = {
  getProfile,
  updateProfile,
  updatePassword,
  deleteProfile,
  getAllUsers,
};
