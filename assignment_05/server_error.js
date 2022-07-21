const internalServerError = (res, error) => {
  return res.status(500).json({
    message: 'Internal Server Error',
    error,
  }); // 500: Internal Server Error
};

module.exports = internalServerError;
