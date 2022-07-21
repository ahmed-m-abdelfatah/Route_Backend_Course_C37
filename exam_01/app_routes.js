const express = require('express');
const path = require('path');
const indexRouter = require('./modules/index_router.js');

function appRoutes(app) {
  app.use(express.json());
  app.use('/uploads', express.static(path.join(__dirname, './uploads')));
  app.use(process.env.CHANNEL + '/auth', indexRouter.authRouter);
  app.use(process.env.CHANNEL + '/user', indexRouter.userRouter);
  app.use(process.env.CHANNEL + '/product', indexRouter.productRouter);
  app.use(process.env.CHANNEL + '/comment', indexRouter.commentRouter);
  app.use(process.env.CHANNEL + '/admin', indexRouter.administrationRouter);
}

module.exports = appRoutes;
