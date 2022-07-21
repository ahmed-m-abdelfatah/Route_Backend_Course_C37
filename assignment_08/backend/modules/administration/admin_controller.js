const userModel = require('../../DB/model/user_model.js');
const { roles } = require('../../middleware/auth.js');
const sendEmail = require('../../services/email.js');

const getAllUsers = async (req, res) => {
  let searchFilter;

  switch (req.user.role) {
    case roles.Admin: {
      searchFilter = { $or: [{ role: roles.HR }, { role: roles.user }] };
      break;
    }

    case roles.HR: {
      searchFilter = { $or: [{ role: roles.user }] };
      break;
    }

    default: {
      return res.status(401).json({ message: 'User not authorized' }); // 401 Unauthorized
    }
  }

  const users = await userModel.find(searchFilter).select('-password');
  res.status(200).json({ message: 'Done', users }); // 200 OK
};

const changeRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const user = await userModel.findOneAndUpdate({ _id: id }, { role });

  sendEmail(user.email, 'ROLE CHANGED', `<h1>Admin changed your privilege to ${role}</h1>`);
  res.status(200).json({ message: 'Done' }); // 200 OK
};

const blockUser = async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findOneAndUpdate({ _id: id }, { isBlocked: true });
  sendEmail(user.email, 'BLOCKED', `<h1>${req.user.role} blocked your account</h1>`);
  res.status(200).json({ message: 'Done' }); // 200 OK
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findByIdAndDelete({ _id: id });

  sendEmail(user.email, 'DELETED', `<h1>${req.user.role} deleted your account for real</h1>`);
  res.status(200).json({ message: 'Done' }); // 200 OK
};

module.exports = {
  getAllUsers,
  changeRole,
  blockUser,
  deleteUser,
};
