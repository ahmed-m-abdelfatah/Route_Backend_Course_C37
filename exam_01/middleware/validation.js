const dataMethods = ['body', 'params', 'query'];

const validation = schema => {
  return (req, res, next) => {
    const validationErrors = [];

    dataMethods.forEach(key => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], { abortEarly: false /* allowUnknown: true */ });

        if (validationResult?.error?.details) {
          validationResult.error.details.forEach(detail => {
            const msg = detail.message.replace(/\"/g, '');

            validationErrors.push({
              msg: msg.charAt(0).toUpperCase() + msg.slice(1),
              type: detail.type,
            });
          });
        }
      }
    });

    if (validationErrors.length) {
      return res.status(422).json({ message: 'validation error', err: validationErrors }); // 422: Unprocessable Entity
    }

    next();
  };
};

module.exports = validation;
