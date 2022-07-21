const { GraphQLObjectType, GraphQLString } = require('graphql');

const loginType = new GraphQLObjectType({
  name: 'loginType',
  description: '',
  fields: {
    message: {
      type: GraphQLString,
    },
    token: {
      type: GraphQLString,
    },
  },
});

module.exports = { loginType };
