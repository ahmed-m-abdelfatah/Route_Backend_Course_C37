const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLList } = require('graphql');

const userType = new GraphQLObjectType({
  name: 'userType',
  description: 'userType',
  fields: {
    message: { type: GraphQLString },
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    emailConfirmed: { type: GraphQLBoolean },
    // password: { type: GraphQLString },
    role: { type: GraphQLString },
    blogs: { type: new GraphQLList(GraphQLID) },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

module.exports = { userType };
