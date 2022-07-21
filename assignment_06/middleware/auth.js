const jwt = require('jsonwebtoken');
const userModel = require('../DB/model/user_model.js');
const internalServerError = require('../utils/internal_server_error.js');

const roles = {
  user: 'user',
  Admin: 'admin',
};

const auth = accessRoles => {
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
        }); // 401 Unauthorized
      }

      const token = headerToken.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      if (!decoded.isSignedIn) {
        return res.status(401).json({
          message: 'Invalid token',
        }); // 401 Unauthorized
      }

      const findUser = await userModel.findById(decoded.id).select('-password');

      if (!findUser) {
        return res.status(401).json({
          message: 'User not found',
        }); // 401 Unauthorized
      }

      if (!accessRoles.includes(findUser.role)) {
        return res.status(401).json({
          message: 'User not authorized',
        }); // 401 Unauthorized
      }

      // Add user to req object
      req.user = findUser;
      next();
    } catch (error) {
      internalServerError(res, error);
    }
  };
};

module.exports = {
  auth,
  roles,
};
