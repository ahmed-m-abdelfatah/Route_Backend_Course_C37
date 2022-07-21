const userModel = require('../../DB/model/user_model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const internalServerError = require('../../utils/internal_server_error.js');

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const newUser = new userModel({
      name,
      email,
      password,
    });
    console.log('~ newUser', newUser);

    const savedUser = await newUser.save();

    res.status(201).json({ message: 'User created', savedUser }); // 201: Created
  } catch (error) {
    if (error?.keyValue?.email) {
      res.status(409).json({ message: 'Email already exists' }); // 409: Conflict
    } else {
      internalServerError(res, error);
    }
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' }); // 404: Not Found
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(404).json({ message: 'Invalid email or password' }); // 404: Not Found
    }

    const token = jwt.sign({ id: user._id, isSignedIn: true }, process.env.JWT_SECRET_KEY);

    res.status(200).json({ message: 'User logged in', token }); // 200: OK
  } catch (error) {
    internalServerError(res, error);
  }
};

module.exports = {
  signup,
  signin,
};
