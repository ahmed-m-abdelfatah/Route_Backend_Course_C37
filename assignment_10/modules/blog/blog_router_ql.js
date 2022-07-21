const { GraphQLSchema, GraphQLObjectType } = require('graphql');
const controller = require('./blog_controller_ql.js');

const blogSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'blogQuery',
    description: 'blog query',
    fields: {
      helloBlog: controller.helloBlog(),
    },
  }),
  mutation: new GraphQLObjectType({
    name: 'blogMutation',
    description: 'blog mutation',
    fields: {
      addBlog: controller.addBlog(),
      deleteBlog: controller.deleteBlog(),
      updateBlog: controller.updateBlog(),
    },
  }),
});

module.exports = blogSchema;
