const Joi = require('joi');

const userKeyPattern = {
  userName: Joi.string()
    .pattern(/^@[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/)
    .messages({
      'string.pattern.base': `
          - User name must start with @.
          - User name must be between 3 and 30 characters.
          - The accepted characters are like you said: a-z A-Z 0-9 dot(.) underline(_).
          - It's not allowed to have two or more consecutive dots in a row.
          - It's not allowed to start or end the username with a dot.

      `,
    }),
  email: Joi.string().email({ minDomainSegments: 2, tlds: false }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).messages({
    'string.pattern.base': 'Password must be alphanumeric and at least 3 characters long',
  }),
  cPassword: ref =>
    Joi.string().valid(Joi.ref(ref)).messages({
      'any.only': `Password and Confirm Password must be same`,
    }),
  phone: Joi.string()
    .pattern(/^01[0125][0-9]{8}$/)
    .messages({
      'string.pattern.base': 'Phone number must be a valid EGY number',
    }),
  gender: Joi.valid('male', 'female'),
  age: Joi.number().min(18).max(80),
  id: Joi.string().min(24).max(24),
  role: Joi.valid('user', 'admin', 'hr'),
  token: Joi.string(),
};

const postKeyPattern = {
  postContent: Joi.string().max(140),
};

const commentKeyPattern = {
  postId: Joi.string().min(24).max(24),
  commentId: Joi.string().min(24).max(24),
  commentContent: Joi.string().max(140),
};

module.exports = {
  userKeyPattern,
  postKeyPattern,
  commentKeyPattern,
};
