const { GraphQLString, GraphQLNonNull, GraphQLInt, GraphQLID } = require('graphql');
const blogModel = require('../../DB/model/blog_model.js');
const validationQL = require('../../middleware/validation_ql.js');
const validators = require('./blog_validation_schema.js');
const { authQL, roles } = require('../../middleware/auth_ql.js');
const endPoint = require('./blog_end_point.js');
const { blogType } = require('./blog_types_ql.js');
const { UserInputError } = require('apollo-server-errors');

const helloBlog = () => {
  return {
    type: GraphQLString,
    resolve: () => {
      return 'Blog Query Work';
    },
  };
};

const addBlog = () => {
  const args = {
    token: { type: new GraphQLNonNull(GraphQLString) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    desc: { type: new GraphQLNonNull(GraphQLString) },
    price: { type: new GraphQLNonNull(GraphQLInt) },
  };

  const resolve = async (parent, args, context, resolveInfo) => {
    try {
      const { value, error } = validationQL(validators.addBlog, args);

      if (error && error.length > 0) {
        throw new UserInputError(error);
      }

      const user = await authQL(value.token, endPoint.addBlog);

      const { title, desc, price } = value;

      const newBlog = new blogModel({ title, desc, price, createdBy: user._id });
      await newBlog.save();

      newBlog.message = 'done';

      return newBlog;
    } catch (error) {
      throw new UserInputError(error.message);
    }
  };

  return {
    type: blogType,
    args,
    resolve,
  };
};

const deleteBlog = () => {
  const args = {
    token: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
  };

  const resolve = async (parent, args) => {
    try {
      const { value, error } = validationQL(validators.deleteBlog, args);

      if (error && error.length > 0) {
        throw new UserInputError(error);
      }

      const user = await authQL(value.token, endPoint.deleteBlog);
      const { id } = value;

      if (user.role === roles.admin) {
        const blog = await blogModel.findByIdAndDelete(id);
        if (!blog) {
          return new UserInputError('blog not found');
        }
        return 'deleted by admin';
      } else {
        const blog = await blogModel.findOneAndDelete({ _id: id, createdBy: user._id });
        if (!blog) {
          return new UserInputError('blog not found');
        }
        return 'deleted by owner';
      }
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

const updateBlog = () => {
  const args = {
    token: { type: new GraphQLNonNull(GraphQLString) },
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    desc: { type: GraphQLString },
    price: { type: GraphQLInt },
  };

  const resolve = async (parent, args) => {
    try {
      const { value, error } = validationQL(validators.updateBlog, args);

      if (error && error.length > 0) {
        throw new UserInputError(error);
      }

      const user = await authQL(value.token, endPoint.updateBlog);
      const { id, title, desc, price } = value;

      const blog = await blogModel.findOneAndUpdate(
        { _id: id, createdBy: user._id },
        { title, desc, price, $inc: { __v: 1 } },
        { new: true },
      );
      if (!blog) {
        return new UserInputError('blog not found');
      }

      blog.message = 'done';
      return blog;
    } catch (error) {
      throw new UserInputError(error.message);
    }
  };

  return {
    type: blogType,
    args,
    resolve,
  };
};

module.exports = { helloBlog, addBlog, deleteBlog, updateBlog };
