const blogModel = require('../../../DB/model/blogModel.js');

const addBlog = (req, res) => {
  const { title, content, userId } = req.body;

  if (!title || !content || !userId) {
    return res.status(400).json({
      message: 'Bad request',
    });
  }

  blogModel
    .create({
      title,
      content,
      userId,
    })
    .then(blog => {
      res.status(200).json({
        message: 'Blog added successfully',
        blog,
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Internal server error',
        err,
      });
    });
};

const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const blog = await blogModel.update(
      {
        title,
        content,
      },
      {
        where: {
          id,
        },
      },
    );

    if (blog[0]) {
      res.status(200).json({
        message: 'Blog updated successfully',
      });
    } else {
      res.status(404).json({
        message: 'Blog not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error,
    });
  }
};

const displayAllBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.findAll();

    res.status(200).json({
      message: 'All blogs',
      numberOfBlogs: blogs.length,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error,
    });
  }
};

const displayBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findOne({
      where: {
        id,
      },
    });
    console.log('~ blog', blog);

    if (blog) {
      res.status(200).json({
        message: 'Blog found',
        blog,
      });
    } else {
      res.status(404).json({
        message: 'Blog not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error,
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.destroy({
      where: {
        id,
      },
    });
    console.log('~ blog', blog);

    if (blog) {
      res.status(200).json({
        message: 'Blog deleted successfully',
      });
    } else {
      res.status(404).json({
        message: 'Blog not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error,
    });
  }
};

module.exports = {
  addBlog,
  updateBlog,
  displayAllBlogs,
  displayBlogById,
  deleteBlog,
};
