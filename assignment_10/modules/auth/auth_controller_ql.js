const { GraphQLString, GraphQLNonNull } = require('graphql');
const userModel = require('../../DB/model/user_model.js');
const validationQL = require('../../middleware/validation_ql.js');
const validators = require('./auth_validation_schema.js');
const { UserInputError } = require('apollo-server-express');
const getSymbolKey = require('../../utils/get_symbol_key.js');
const { sendConfirmationEmailQL } = require('../../utils/send_emails.js');
const { loginType } = require('./auth_types_ql.js');
const generateToken = require('../../utils/generate_token.js');
const bcrypt = require('bcryptjs');
const sendEmail = require('../../services/email.js');

const helloAuth = () => {
  return {
    type: GraphQLString,
    resolve: () => {
      return 'Auth Query Work';
    },
  };
};

const signup = () => {
  const args = {
    name: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
    cPassword: { type: new GraphQLNonNull(GraphQLString) },
  };

  const resolve = async (parent, args, context, resolveInfo) => {
    // function should called out of try catch block
    const originUrl = getSymbolKey(context, 'Symbol(kHeaders)')['origin'];
    // console.log('~ originUrl', originUrl);

    try {
      const { value, error } = validationQL(validators.signup, args);

      if (error && error.length > 0) {
        throw new UserInputError(error);
      }

      const user = await userModel.findOne({ email: value.email });

      if (user) {
        throw new UserInputError('User already exists');
      }

      const newUser = new userModel(value);
      await newUser.save();

      sendConfirmationEmailQL(originUrl, newUser, 5 * 60);

      return 'User created successfully please verify your email';
    } catch (error) {
      throw new UserInputError(error.message);
    }
  };

  return {
    type: GraphQLString, // no need to define custom type
    args,
    resolve,
  };
};

const login = () => {
  const args = {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  };

  const resolve = async (parent, args, context, resolveInfo) => {
    try {
      const { value, error } = validationQL(validators.login, args);

      if (error && error.length > 0) {
        throw new UserInputError(error);
      }

      const user = await userModel.findOne({ email: value.email });

      if (!user) {
        throw new UserInputError('User does not exist');
      }

      if (!user.emailConfirmed) {
        throw new UserInputError('Please verify your email');
      }

      const match = await bcrypt.compare(value.password, user.password);
      console.log('~ match', match);

      if (!match) {
        throw new UserInputError('Email or password is incorrect');
      }

      const token = generateToken(user);

      return {
        message: 'Login successful',
        token,
      };
    } catch (error) {
      throw new UserInputError(error.message);
    }
  };

  return {
    type: loginType,
    args,
    resolve,
  };
};

const forgetPasswordSendCode = () => {
  const args = {
    email: { type: new GraphQLNonNull(GraphQLString) },
  };

  const resolve = async (parent, args, context, resolveInfo) => {
    try {
      const { value, error } = validationQL(validators.forgetPasswordSendCode, args);

      if (error && error.length > 0) {
        throw new UserInputError(error);
      }

      const user = await userModel.findOne({ email: value.email });

      if (!user) {
        throw new UserInputError('User does not exist');
      }

      const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000); // random code

      message = `<p>use this code to update your password  : ${code} </p>`;
      await userModel.findByIdAndUpdate(user._id, { code });

      sendEmail(user.email, 'Forget password code', message);

      return 'Email sent successfully';
    } catch (error) {
      throw new UserInputError(error.message);
    }
  };

  return {
    type: GraphQLString,
    args,
    resolve,
  };
};

const forgetPassword = () => {
  const args = {
    email: { type: new GraphQLNonNull(GraphQLString) },
    code: { type: new GraphQLNonNull(GraphQLString) },
    newPassword: { type: new GraphQLNonNull(GraphQLString) },
    cNewPassword: { type: new GraphQLNonNull(GraphQLString) },
  };

  const resolve = async (parent, args, context, resolveInfo) => {
    try {
      const { value, error } = validationQL(validators.forgetPassword, args);

      if (error && error.length > 0) {
        throw new UserInputError(error);
      }

      const user = await userModel.findOne({ email: value.email });

      if (!user) {
        throw new UserInputError('User does not exist');
      }

      if (user.code !== value.code) {
        throw new UserInputError('Code is incorrect');
      }

      await userModel.findByIdAndUpdate(user._id, { password: value.newPassword, code: '' });

      return 'Password updated successfully';
    } catch (error) {
      throw new UserInputError(error.message);
    }
  };

  return {
    type: GraphQLString,
    args,
    resolve,
  };
};

module.exports = {
  helloAuth,
  signup,
  login,
  forgetPasswordSendCode,
  forgetPassword,
};
