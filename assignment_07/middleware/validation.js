const dataMethods = ['body', 'params', 'query'];

const validation = schema => {
  return (req, res, next) => {
    const validationErrors = [];

    dataMethods.forEach(key => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key]);

        if (validationResult.error) {
          const msg = validationResult.error.details[0].message.replace(/"/g, '');
          const type = validationResult.error.details[0].type;

          validationErrors.push(
            msg.charAt(0).toUpperCase() + msg.slice(1),

            // type,
          );
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
