const validationQL = (schema, args) => {
  const { value, error } = schema.validate(args, { abortEarly: false });
  const validationErrors = [];
  let validationErrorsMsg = [];

  if (error) {
    error.details.forEach(detail => {
      const msg = detail.message.replace(/\"/g, '');

      validationErrors.push({
        msg: msg.charAt(0).toUpperCase() + msg.slice(1),
        type: detail.type,
      });
    });

    validationErrorsMsg = validationErrors.map(error => {
      return error.msg;
    });
  }

  return { value, error: validationErrorsMsg };
};

module.exports = validationQL;
