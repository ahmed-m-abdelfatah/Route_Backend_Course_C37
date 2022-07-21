const router = require('express').Router();
const { addBlog } = require('./controller/addBlog.js');
const { displayBlogPage } = require('./controller/blogPage.js');
const { displayBlogList } = require('./controller/displayBlogList.js');

router.get('/blog', displayBlogPage);
router.post('/blog/add', addBlog);
router.get('/blog/display', displayBlogList);

module.exports = router;
