module.exports = (res, status = 500, message = 'Internal Server Error', error = null) => {
  const payload = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV !== 'production' && error) {
    payload.error = error?.message || error;
  }

  res.status(status).json(payload);
};
