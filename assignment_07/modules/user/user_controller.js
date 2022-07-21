const userModel = require('../../DB/model/user_model.js');
const path = require('path');
const fs = require('fs');
const internalServerError = require('../../utils/internal_server_error.js');

const displayProfile = async (req, res) => {
  const { id } = req.user;

  const user = await userModel
    .findById(id)
    .populate({
      path: 'messages',
      select: '-createdAt -updatedAt -__v -createdBy',
    })
    .select('-password -createdAt -updatedAt');

  res.status(200).json({ message: 'Done', user });
};

const updateProfile = async (req, res) => {
  const { id } = req.user;

  const user = await userModel.findByIdAndUpdate(id, req.body, { new: true }).select('-password -createdAt -updatedAt');

  res.status(200).json({ message: 'Done', user });
};

const updateProfilePic = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ message: 'Invalid file format' }); // 400 Bad Request
    }

    const user = await userModel.findById(req.user.id);

    if (user.profilePic) {
      fs.unlinkSync(user.profilePic); // Relative path
    }

    const newImageURL = `${req.filePath}/${req.file.filename}`;
    const updatedUserImage = await userModel.findByIdAndUpdate(req.user.id, { profilePic: newImageURL }, { new: true });

    res.status(200).json({ message: 'Done', updatedUserImage }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const updateProfileCoverPic = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res.status(400).json({ message: 'Invalid file format' }); // 400 Bad Request
    }

    const imageUrls = [];

    imageUrls.forEach(file => {
      imageUrls.push(`${req.filePath}/${req.file.filename}`);
    });

    const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { coverPics: imageUrls }, { new: true });

    res.status(200).json({ message: 'Done', user }); // 200 OK
  } catch (error) {
    internalServerError(res, error);
  }
};

module.exports = {
  displayProfile,
  updateProfile,
  updateProfilePic,
  updateProfileCoverPic,
};
