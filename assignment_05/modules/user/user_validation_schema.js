const Joi = require('joi');

// user patterns
const namePattern = Joi.string().min(3).max(20).required();
const emailPattern = Joi.string().email({ minDomainSegments: 2, tlds: false }).required();
const passwordPattern = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().messages({
  'string.pattern.base': 'Password must be alphanumeric and at least 3 characters long',
});
const phonePattern = Joi.string()
  .pattern(/^01[0|1|2][0-9]{8}$/)
  .required()
  .messages({
    'string.pattern.base': 'Phone number must be a valid EGY number',
  });

// product patterns
// mongoDBId = 627ab921039867cb7d1b601a
const idPattern = Joi.string().min(24).max(24).required();

const signupValidationSchema = {
  body: Joi.object()
    .required()
    .keys({
      name: namePattern,
      email: emailPattern,
      phone: phonePattern,
      password: passwordPattern,
      cPassword: Joi.string().required().valid(Joi.ref('password')).messages({
        'any.only': 'password and confirm password must be the same',
      }), // validates that the password and confirm password are the same
    }),
};

const signinValidationSchema = {
  body: Joi.object().required().keys({
    email: emailPattern,
    password: passwordPattern,
  }),
};

const updateValidationSchema = {
  body: Joi.object().required().keys({
    name: namePattern,
    phone: phonePattern,
  }),
};

const getUserByIdSchema = {
  params: Joi.object().required().keys({
    id: idPattern,
  }),
};

module.exports = {
  signupValidationSchema,
  signinValidationSchema,
  updateValidationSchema,
  getUserByIdSchema,
};
