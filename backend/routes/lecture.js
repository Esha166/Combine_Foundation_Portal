import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import { upload } from '../utils/cloudinary.js';
import { 
  getLectures, 
  getLecture, 
  createLecture, 
  updateLecture, 
  deleteLecture, 
  toggleLectureStatus,
  getLecturesByAuthor,
  getLecturesByCategory
} from '../controllers/lectureController.js';

const lectureRoute = express.Router();

// Public routes
lectureRoute.get('/', getLectures);
lectureRoute.get('/:id', getLecture);
lectureRoute.get('/author/:authorId', getLecturesByAuthor);
lectureRoute.get('/category/:category', getLecturesByCategory);

// Private routes for authorized users only
lectureRoute.use(protect);

// For creating lectures with optional thumbnail upload
lectureRoute.post('/', upload.single('thumbnail'), restrictTo('admin', 'superadmin', 'developer'), createLecture);

// For updating lectures with optional thumbnail upload
lectureRoute.put('/:id', upload.single('thumbnail'), restrictTo('admin', 'superadmin', 'developer'), updateLecture);

lectureRoute.delete('/:id', restrictTo('admin', 'superadmin', 'developer'), deleteLecture);
lectureRoute.patch('/:id/toggle-status', restrictTo('admin', 'superadmin', 'developer'), toggleLectureStatus);

export default lectureRoute;