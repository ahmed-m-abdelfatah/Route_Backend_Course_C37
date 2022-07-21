const userModel = require('../DB/model/user.js');

const signup = async (req, res) => {
  const newUser = new userModel(req.body);
  const savedUser = await newUser.save();

  res.json({ msg: 'done', savedUser });
};

module.exports = {
  signup,
};
