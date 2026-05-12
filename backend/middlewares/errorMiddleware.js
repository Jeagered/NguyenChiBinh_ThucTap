const notFound = (req, res, next) => {
  const error = new Error(`Khong tim thay duong dan ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Loi may chu';

  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Khong tim thay du lieu';
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'du lieu';
    message = `${field} da ton tai`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((item) => item.message)
      .join(', ');
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token khong hop le';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token da het han';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
