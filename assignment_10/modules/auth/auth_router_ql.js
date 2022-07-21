const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const controller = require('./auth_controller_ql.js');

const authSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'auth',
    description: 'auth query',
    fields: {
      helloAuth: controller.helloAuth(),
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'AuthMutation',
    description: 'auth mutation',
    fields: {
      signup: controller.signup(),
      login: controller.login(),
      forgetPasswordSendCode: controller.forgetPasswordSendCode(),
      forgetPassword: controller.forgetPassword(),
    },
  }),
});

module.exports = authSchema;
