const jwt = require('jsonwebtoken');
const userModel = require('../DB/model/user_model.js');
const internalServerError = require('../server_error.js');

const auth = () => {
  return async (req, res, next) => {
    try {
      const headerToken = req.headers['authorization'];
      // console.log('~ headerToken', headerToken);

      if (
        !headerToken ||
        headerToken === null ||
        headerToken === undefined ||
        !headerToken.startsWith(process.env.BEARER_SECRETE + ' ')
      ) {
        return res.status(401).json({
          message: 'Invalid header token',
        });
      }

      const token = headerToken.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      if (!decoded.isSignedIn) {
        return res.status(401).json({
          message: 'Invalid token',
        });
      }

      const findUser = await userModel.findById(decoded.id).select('-password');

      if (!findUser) {
        return res.status(401).json({
          message: 'User not found',
        });
      }

      // add user to req object
      req.user = findUser;
      next();
    } catch (error) {
      internalServerError(res, error);
    }
  };
};

module.exports = auth;
