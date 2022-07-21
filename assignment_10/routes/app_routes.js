const express = require('express');
const indexRouter = require('../modules/index_router.js');

function appRoutes(app) {
  app.use(express.json());
  app.use('/auth', indexRouter.authRouter);
  app.use('/blog', indexRouter.blogRouter);
}

module.exports = appRoutes;
