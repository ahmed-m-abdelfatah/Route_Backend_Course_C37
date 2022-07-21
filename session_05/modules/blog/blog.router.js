const {
  addBlog,
  updateBlog,
  displayAllBlogs,
  displayBlogById,
  deleteBlog,
} = require('./controller/blogCRUD.js');

const blogRouter = require('express').Router();

// Start of blogRouter routes
blogRouter.post('/blog/add', addBlog);
blogRouter.patch('/blog/update/:id', updateBlog);
blogRouter.get('/blog/all', displayAllBlogs);
blogRouter.get('/blog/:id', displayBlogById);
blogRouter.delete('/blog/:id', deleteBlog);

module.exports = blogRouter;
