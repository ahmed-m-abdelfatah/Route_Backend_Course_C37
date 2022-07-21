const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const controller = require('./user_controller_ql.js');

const userSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'userQuery',
    description: 'user query',
    fields: {
      getProfile: controller.getProfile(),
      getAllUsers: controller.getAllUsers(),
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'userMutation',
    description: 'user mutation',
    fields: {
      updateProfile: controller.updateProfile(),
      updatePassword: controller.updatePassword(),
      deleteProfile: controller.deleteProfile(),
    },
  }),
});

module.exports = userSchema;
