const userModel = require('../../DB/model/user_model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const internalServerError = require('../../utils/internal_server_error.js');
const sendEmail = require('../../services/email.js');
const { sendConfirmationEmail } = require('../../utils/send_emails.js');

const signup = async (req, res) => {
  try {
    const { email, password, age } = req.body;
    const newUser = new userModel({ email, password, age });
    const savedUser = await newUser.save();

    sendConfirmationEmail(req, savedUser, 5 * 60);
    res.status(201).json({ message: 'User created check your email to confirm your account', savedUser }); // 201: Created
  } catch (error) {
    if (error?.keyValue?.email) {
      res.status(409).json({ message: 'Email already exists' }); // 409: Conflict
    } else {
      internalServerError(res, error);
    }
  }
};

const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, process.env.JWT_EMAIL_SECRET_KEY);
    const user = await userModel.findById(decoded.id).select('emailConfirmed');
    if (!user) {
      res.status(404).json({ message: 'User not found' }); // 404: Not Found
    } else if (user.emailConfirmed) {
      res.status(409).json({ message: 'User already confirmed' }); // 409: Conflict
    } else {
      user.emailConfirmed = true;
      await user.save();
      res.status(200).json({ message: 'Email confirmed' }); // 200: OK
    }
  } catch (error) {
    internalServerError(res, error);
  }
};

const confirmEmailResendToken = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' }); // 404: Not Found
    } else if (user.emailConfirmed) {
      res.status(409).json({ message: 'User already confirmed' }); // 409: Conflict
    } else {
      sendConfirmationEmail(req, user, 2 * 60);
      res.status(200).json({ message: 'Email sent' }); // 200: OK
    }
  } catch (error) {
    internalServerError(res, error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password' }); // 404: Not Found
    }

    if (!user.emailConfirmed) {
      return res.status(409).json({ message: 'Email not confirmed' }); // 409: Conflict
    }

    if (user.isBlocked) {
      return res.status(409).json({ message: 'User blocked' }); // 409: Conflict
    }

    if (user.isDeactivated) {
      return res.status(409).json({ message: 'User deactivated' }); // 409: Conflict
    }

    if (user.isDeleted) {
      return res.status(404).json({ message: 'Invalid email or password' }); // 404: Not Found
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(404).json({ message: 'Invalid email or password' }); // 404: Not Found
    }

    user.isLoggedIn = true;
    user.LoggedAt = Date.now();
    await user.save();

    const token = jwt.sign({ id: user._id, isSignedIn: true }, process.env.JWT_SECRET_KEY, { expiresIn: '72h' });

    res.status(200).json({ message: 'User logged in', token }); // 200: OK
  } catch (error) {
    internalServerError(res, error);
  }
};

const logout = async (req, res) => {
  try {
    await userModel.findOneAndUpdate(
      { _id: req.user._id },
      {
        LoggedOutAt: Date.now(),
        LoggedInAt: null,
        isLoggedIn: false,
      },
    );

    res.status(200).json({ message: 'Done' });
  } catch (error) {
    internalServerError(res, error);
  }
};

const forgetPasswordSendCode = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(404).json({ message: 'in-valid account' });
  } else {
    const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000); // random code

    message = `<p>use this code to update your password  : ${code} </p>`;
    await userModel.findByIdAndUpdate(user._id, { code });

    sendEmail(email, 'Forget password code', message);
    res.status(200).json({ message: 'Done, check your email' });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'in-valid account' });
    } else {
      if (user.code.toString() != code.toString()) {
        res.status(409).json({ message: 'wrong code' });
      } else {
        user.password = newPassword;
        user.code = '';
        user.isLoggedIn = false;
        await user.save();
        res.status(200).json({ message: 'Done plz go to login' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'catch error ', error });
  }
};

module.exports = {
  signup,
  confirmEmail,
  confirmEmailResendToken,
  login,
  logout,
  forgetPasswordSendCode,
  forgetPassword,
};
