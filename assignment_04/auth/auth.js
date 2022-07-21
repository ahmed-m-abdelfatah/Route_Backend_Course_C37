const jwt = require('jsonwebtoken');
const userModel = require('../DB/model/user_model.js');

// .env
require('dotenv').config();
const jwtSecreteKey = process.env.JWT_SECRET_KEY;

const auth = () => {
  return async (req, res, next) => {
    try {
      const headerToken = req.headers['authorization'];
      // console.log('~ headerToken', headerToken);

      if (!headerToken || headerToken === null || headerToken === undefined || !headerToken.startsWith('Bearer ')) {
        res.json({
          message: 'Invalid header token',
        });
      } else {
        const token = headerToken.split(' ')[1];
        // console.log('~ token', token);

        const decoded = jwt.verify(token, jwtSecreteKey);
        // console.log('~ decoded', decoded);

        if (decoded.isSignin) {
          const findUser = await userModel.findById(decoded.id).select('-password');

          if (findUser) {
            req.user = findUser;
            next();
          } else {
            res.json({
              message: 'User not found',
            });
          }
        } else {
          res.json({
            message: 'Invalid token',
          });
        }
      }
    } catch (error) {
      res.json({
        message: 'Token catch error',
      });
    }
  };
};

module.exports = auth;
