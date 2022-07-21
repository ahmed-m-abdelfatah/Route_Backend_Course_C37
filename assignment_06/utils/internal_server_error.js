const internalServerError = (res, error) => {
  console.log('~ error', error);
  return res.status(500).json({
    message: 'Internal Server Error',
    error,
  });
};

module.exports = internalServerError;
