const postModel = require('../../DB/model/post_model.js');
const fs = require('fs');
const internalServerError = require('../../utils/internal_server_error.js');

const addPost = async (req, res) => {
  try {
    console.log('~ addPost req.body', req.body);
    const { postContent } = req.body;
    const imageUrls = [];

    if (req.files) {
      if (req.fileValidationError) {
        return res.status(400).json({ message: 'Invalid file format' }); // 400 Bad Request
      }

      req.files.forEach(file => {
        imageUrls.push(`${req.filePath}/${file.filename}`);
      });
    }

    const addedData = imageUrls.length > 0 ? { postContent, postPics: imageUrls } : { postContent };

    const post = await postModel.create({ ...addedData, createdBy: req.user._id });

    res.status(201).json({ message: 'Done', post }); // 201 Created
  } catch (error) {
    internalServerError(res, error);
  }
};

const updatePost = async (req, res) => {
  try {
    console.log('~ updatePost req.body', req.body);
    const { id } = req.params;
    const { postContent } = req.body;
    const imageUrls = [];

    const post = await postModel.findById(id);

    if (req.files) {
      if (req.fileValidationError) {
        return res.status(400).json({ message: 'Invalid file format' }); // 400 Bad Request
      }

      if (post.postPics) {
        post.postPics.forEach(pic => {
          fs.unlinkSync(pic); // Relative path
        });
      }

      req.files.forEach(file => {
        imageUrls.push(`${req.filePath}/${file.filename}`);
      });
    }

    const updatedData = imageUrls.length > 0 ? { postContent, postPics: imageUrls } : { postContent };

    const updatedPost = await postModel.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json({ message: 'Done', updatedPost }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedBy: req.user._id, deletedAt: Date.now() },
      { new: true },
    );

    if (!post) {
      return res.status(404).json({ message: 'Post not found' }); // 404 Not Found
    }

    res.status(200).json({ message: 'Done' }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id;
    const post = await postModel.findById(id);

    if (!post || post.isDeleted) {
      return res.status(404).json({ message: 'Post not found' }); // 404 Not Found
    }

    if (post.createdBy.toString() === currentUserId.toString()) {
      return res.status(400).json({ message: 'You cannot like your own post' }); // 400 Bad Request
    }

    const likes = post.likes.includes(currentUserId)
      ? post.likes.filter(user => user.toString() !== currentUserId.toString())
      : [...post.likes, currentUserId];

    const updatedPost = await postModel.findByIdAndUpdate(id, { likes }, { new: true });

    res.status(200).json({ message: 'Done', updatedPost }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

module.exports = {
  addPost,
  updatePost,
  deletePost,
  likePost,
};
