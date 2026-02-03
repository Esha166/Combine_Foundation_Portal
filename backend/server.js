import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import { limiter } from './middleware/rateLimiter.js';

// Import discriminator models to register them with the base User model
import './models/Trustee.js';
import './models/Volunteer.js';
import './models/Admin.js';
import './models/SuperAdmin.js';
import './models/Developer.js';
import './models/Lecture.js';

// routes
import authRoute from './routes/auth.js';
import volunteerRoute from './routes/volunteer.js';
import adminRouter from './routes/admin.js';
import trusteeRoute from './routes/trustee.js';
import courseRoute from './routes/course.js';
import postRoute from './routes/post.js';
import userRoute from './routes/user.js';
import taskRoute from './routes/taskRoutes.js';
import logsRoute from './routes/logs.js';
import idCardRoute from './routes/idCard.js';
import lectureRoute from './routes/lecture.js';
import categoryRoute from './routes/categoryRoutes.js';

// Load env vars
const result = dotenv.config();
if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('Environment variables loaded successfully');
}

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Sanitize data (prevent NoSQL injection)
// app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
app.use('/api/', limiter);

// Mount routes
app.use('/api/auth', authRoute);
app.use('/api/volunteers', volunteerRoute);
app.use('/api/admin', adminRouter);
app.use('/api/trustee', trusteeRoute);
app.use('/api/courses', courseRoute);
app.use('/api/posts', postRoute);
app.use('/api/user', userRoute);
app.use('/api/tasks', taskRoute);
app.use('/api/logs', logsRoute);
app.use('/api/idcard', idCardRoute);
app.use('/api/lectures', lectureRoute);
app.use('/api/categories', categoryRoute);

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Handle multer errors specifically
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size allowed is 5MB.'
      });
    } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name for image upload. Please use "image" as the field name.'
      });
    } else if (error.code === 'LIMIT_FORM_FIELDS') {
      return res.status(400).json({
        success: false,
        message: 'Form fields limit exceeded.'
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message
    });
  } else if (error.message && error.message.includes('Only image files are allowed')) {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed (jpg, jpeg, png, webp).'
    });
  }

  next(error);
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

