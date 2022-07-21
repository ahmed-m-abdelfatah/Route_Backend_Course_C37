const { graphqlHTTP } = require('express-graphql');
const indexRouterQL = require('../modules/index_router_ql.js');

function graphqlRoutes(app) {
  const opt = schema => ({
    schema,
    graphiql: true,
  });

  app.use('/auth-ql', graphqlHTTP(opt(indexRouterQL.authRouterQL)));
  app.use('/user-ql', graphqlHTTP(opt(indexRouterQL.userRouterQL)));
  app.use('/blog-ql', graphqlHTTP(opt(indexRouterQL.blogRouterQL)));
}

module.exports = graphqlRoutes;
