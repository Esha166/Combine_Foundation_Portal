import winston from 'winston';
import ErrorLog from '../models/ErrorLog.js'; // Import the ErrorLog model

// Check if we're in a serverless environment (like Vercel)
const isServerless = process.env.VERCEL || process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME;

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Only add file transports if not in serverless environment
    ...(isServerless ? [] : [
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
    ])
  ]
});

// Console logging in development and in serverless environments (since file logging is disabled)
if (process.env.NODE_ENV !== 'production' || isServerless) {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
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