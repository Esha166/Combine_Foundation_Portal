import express from 'express';
import { getAllCourses, getCourse, createCourse, updateCourse, deleteCourse } from '../controllers/courseController.js';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { upload } from '../utils/cloudinary.js';

const courseRoute = express.Router();

// Public routes
courseRoute.get('/', getAllCourses);
courseRoute.get('/:id', getCourse);

// Protected routes (admin/superadmin/developer only)
courseRoute.use(protect);
courseRoute.use(roleCheck('admin', 'superadmin', 'developer'));

// Apply permission check for admins
import { checkPermission } from '../middleware/checkPermission.js';

courseRoute.post('/', checkPermission('manage_courses'), upload.single('image'), createCourse);
courseRoute.put('/:id', checkPermission('manage_courses'), upload.single('image'), updateCourse);
courseRoute.delete('/:id', checkPermission('manage_courses'), deleteCourse);

export default courseRoute;