const jwt = require('jsonwebtoken');
const sendEmail = require('../services/email.js');

const sendConfirmationEmail = (req, user, expiration = 1 * 60) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_EMAIL_SECRET_KEY, { expiresIn: expiration });
  const confirmUrl = `${req.protocol}://${req.headers.host}${process.env.CHANNEL}/auth/confirmEmail/${token}`;
  const refreshToken = `${req.protocol}://${req.headers.host}${process.env.CHANNEL}/auth/resendToken/${user._id}`;

  message = `
          <a href='${confirmUrl}' target='_blank'>Click here to confirm your account</a>
          <br>
          <a href='${refreshToken}'  target='_blank'>refresh token</a>
          `;

  sendEmail(user.email, 'Confirm your account', message);
};

module.exports = {
  sendConfirmationEmail,
};
