import winston from 'winston';
import ErrorLog from '../models/ErrorLog.js'; // Import the ErrorLog model

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5
    })
  ]
});

// Console logging in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Function to log error to database as well
logger.logToDB = async (level, message, meta = {}) => {
  try {
    // Only log errors, warnings, and important info to the database
    if (['error', 'warn', 'info'].includes(level.toLowerCase())) {
      await ErrorLog.create({
        level: level.toLowerCase(),
        message: message,
        stack: meta.stack || null,
        meta: meta,
        source: meta.source || 'system',
        userId: meta.userId || null,
        endpoint: meta.endpoint || null,
        statusCode: meta.statusCode || null
      });
    }
  } catch (err) {
    console.error('Failed to log to database:', err.message);
  }
};

export default logger;