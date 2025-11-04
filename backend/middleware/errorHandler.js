import logger from '../utils/logger.js';

const errorHandler = async (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error to both file and database
  await logger.logToDB('error', err.message, {
    stack: err.stack,
    source: 'errorHandler',
    endpoint: req.originalUrl,
    userId: req.user ? req.user.id : null,
    statusCode: error.statusCode || 500,
    method: req.method,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });

  // Log error for dev
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export default errorHandler;
