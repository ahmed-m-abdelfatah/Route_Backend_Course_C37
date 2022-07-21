const blogModel = require('../../DB/model/blog_model.js');
const fs = require('fs');

const addPics = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ message: 'Invalid file format' }); // 400 Bad Request
    }

    // get blog
    const blog = await blogModel.findOne({ _id: req.body.id, createdBy: req.user._id });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' }); // 404 Not Found
    }

    // delete old pic if there is one
    if (blog.pics) {
      blog.pics.forEach(pic => {
        try {
          fs.unlinkSync(pic);
        } catch (error) {
          console.log('~ unlinkSync error', error);
        }
      });
    }

    const imageUrls = [];

    req.files.forEach(file => {
      imageUrls.push(`${req.filePath}/${file.filename}`);
    });

    const updatedBlog = await blogModel.findByIdAndUpdate(
      req.body.id,
      { pics: imageUrls, $inc: { __v: 1 } },
      { new: true },
    );

    res.status(200).json({ message: 'Done adding pics to blog', updatedBlog }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

module.exports = {
  addPics,
};
