import express from 'express';
import { getAllPosts, getPost, createPost, updatePost, deletePost } from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { upload } from '../utils/cloudinary.js';

const postRoute = express.Router();

// Public routes
postRoute.get('/', getAllPosts);
postRoute.get('/:id', getPost);

// Protected routes (admin/superadmin/developer only)
postRoute.use(protect);
postRoute.use(roleCheck('admin', 'superadmin', 'developer'));

// Check permissions
import { checkPermission } from '../middleware/checkPermission.js';

postRoute.post('/', checkPermission('manage_posts'), upload.single('image'), createPost);
postRoute.put('/:id', checkPermission('manage_posts'), upload.single('image'), updatePost);
postRoute.delete('/:id', checkPermission('manage_posts'), deletePost);

export default postRoute;