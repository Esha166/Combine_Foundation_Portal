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

postRoute.post('/', upload.single('image'), createPost);
postRoute.put('/:id', upload.single('image'), updatePost);
postRoute.delete('/:id', deletePost);

export default postRoute;