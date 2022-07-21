const userModel = require('../../DB/model/user_model.js');

const displayProfile = async (req, res) => {
  const { id } = req.user;

  const user = await userModel.findById(id).select('-password -createdAt -updatedAt');

  res.status(200).json({ message: 'Done', user });
};

const updateProfile = async (req, res) => {
  const { id } = req.user;

  const user = await userModel.findByIdAndUpdate(id, req.body, { new: true }).select('-password -createdAt -updatedAt');

  res.status(200).json({ message: 'Done', user });
};

module.exports = {
  displayProfile,
  updateProfile,
};
