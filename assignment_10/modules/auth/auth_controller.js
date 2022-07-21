const userModel = require('../../DB/model/user_model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const internalServerError = require('../../utils/internal_server_error.js');
const sendEmail = require('../../services/email.js');
const { sendConfirmationEmail } = require('../../utils/send_emails.js');

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

// const forgetPasswordSendCode = async (req, res) => {
//   const { email } = req.body;
//   const user = await userModel.findOne({ email });
//   if (!user) {
//     res.status(404).json({ message: 'in-valid account' });
//   } else {
//     const code = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000); // random code

//     message = `<p>use this code to update your password  : ${code} </p>`;
//     await userModel.findByIdAndUpdate(user._id, { code });

//     sendEmail(email, 'Forget password code', message);
//     res.status(200).json({ message: 'Done, check your email' });
//   }
// };

// const forgetPassword = async (req, res) => {
//   try {
//     const { email, code, newPassword } = req.body;

//     const user = await userModel.findOne({ email });
//     if (!user) {
//       res.status(404).json({ message: 'in-valid account' });
//     } else {
//       if (user.code.toString() != code.toString()) {
//         res.status(409).json({ message: 'wrong code' });
//       } else {
//         user.password = newPassword;
//         user.code = '';
//         user.isLoggedIn = false;
//         await user.save();
//         res.status(200).json({ message: 'Done plz go to login' });
//       }
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'catch error ', error });
//   }
// };

module.exports = {
  confirmEmail,
  confirmEmailResendToken,
  // forgetPasswordSendCode,
  // forgetPassword,
};
