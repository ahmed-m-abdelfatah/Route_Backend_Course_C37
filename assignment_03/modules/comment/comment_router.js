const { displayAllComments, addComment } = require('./comment_controller.js');

const commentRouter = require('express').Router();

commentRouter.post('/comments/add', addComment);
commentRouter.get('/comments/all', displayAllComments);

module.exports = commentRouter;
