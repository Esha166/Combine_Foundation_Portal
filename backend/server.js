import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import {limiter} from './middleware/rateLimiter.js';

// Import discriminator models to register them with the base User model
import './models/Trustee.js';
import './models/Volunteer.js';

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

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// Handle multer errors specifically
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      pass
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
  } else if (error.message && error.message.includes('Only image files are allowed')) {
    return res.status(400).json({
      success: false,
      message: 'Only image files are allowed (jpg, jpeg, png, webp).'
    });
  }
  
  next(error);
});



const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
