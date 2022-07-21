const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLID, GraphQLList } = require('graphql');

const blogType = new GraphQLObjectType({
  name: 'blogType',
  description: 'blogType',
  fields: {
    message: { type: GraphQLString },
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    desc: { type: GraphQLString },
    price: { type: GraphQLBoolean },
    pics: { type: new GraphQLList(GraphQLID) },
    createdBy: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});

module.exports = { blogType };
