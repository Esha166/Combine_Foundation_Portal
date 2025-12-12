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

import { checkPermission } from '../middleware/checkPermission.js';

// For creating lectures with optional thumbnail upload
lectureRoute.post('/', upload.single('thumbnail'), restrictTo('admin', 'superadmin', 'developer'), checkPermission('manage_lectures'), createLecture);

// For updating lectures with optional thumbnail upload
lectureRoute.put('/:id', upload.single('thumbnail'), restrictTo('admin', 'superadmin', 'developer'), checkPermission('manage_lectures'), updateLecture);

lectureRoute.delete('/:id', restrictTo('admin', 'superadmin', 'developer'), checkPermission('manage_lectures'), deleteLecture);
lectureRoute.patch('/:id/toggle-status', restrictTo('admin', 'superadmin', 'developer'), checkPermission('manage_lectures'), toggleLectureStatus);

export default lectureRoute;