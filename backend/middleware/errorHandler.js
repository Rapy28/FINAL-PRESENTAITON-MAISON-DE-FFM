module.exports = function errorHandler(
  res,
  status = 500,
  message = 'Internal Server Error',
  error = null
) {
  if (error) {
    console.error('Error:', error);
  }

  return res.status(status).json({
    success: false,
    message,
  });
};
