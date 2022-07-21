const userModel = require('../../../DB/model/userModel.js');
const blogModel = require('../../../DB/model/blogModel.js');

const displayAllUsers = (req, res) => {
  userModel
    .findAll({
      attributes: ['id', 'name', 'email'],
      include: [{ model: blogModel }],
    })
    .then(users => {
      res.status(200).json({
        message: 'Users retrieved successfully',
        numberOfUsers: users.length,
        users,
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Internal server error',
        err,
      });
    });
};

const displayUserProfile = async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findOne({
    where: { id },
    attributes: ['id', 'name', 'email'],
    include: [{ model: blogModel, attributes: ['id', 'title', 'content'] }],
  });

  if (!user) {
    return res.status(404).json({
      message: 'User not found',
    });
  }

  res.status(200).json({
    message: 'User profile retrieved successfully',
    user,
  });
};

module.exports = {
  displayAllUsers,
  displayUserProfile,
};
