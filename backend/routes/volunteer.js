import express from 'express';
import { createVolunteer, getPendingVolunteers, getAllVolunteers, approveVolunteer, rejectVolunteer, deleteVolunteer, inviteVolunteer, completeVolunteer, getVolunteerCount } from '../controllers/volunteerController.js';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validator.js';
import { rejectVolunteerValidator } from '../validators/volunteerValidator.js';
import { upload } from '../utils/cloudinary.js';

const volunteerRoute = express.Router();

// Public route (webhook from Google Forms)
volunteerRoute.post(
  '/apply',
  upload.fields([
    { name: 'cnicFrontImage', maxCount: 1 },
    { name: 'cnicBackImage', maxCount: 1 }
  ]),
  createVolunteer
);
volunteerRoute.get('/count', getVolunteerCount);

// Protected routes (admin/superadmin/developer only)
volunteerRoute.use(protect);
volunteerRoute.use(roleCheck('admin', 'superadmin', 'developer'));

// Apply permission check for admins
import { checkPermission } from '../middleware/checkPermission.js';

volunteerRoute.get('/pending', checkPermission('manage_volunteers'), getPendingVolunteers);
volunteerRoute.get('/', checkPermission('manage_volunteers'), getAllVolunteers);
volunteerRoute.post('/invite', checkPermission('manage_volunteers'), inviteVolunteer);
volunteerRoute.post('/:id/approve', checkPermission('manage_volunteers'), approveVolunteer);
volunteerRoute.post('/:id/complete', checkPermission('manage_volunteers'), completeVolunteer);
volunteerRoute.post('/:id/reject', checkPermission('manage_volunteers'), validate(rejectVolunteerValidator), rejectVolunteer);
volunteerRoute.delete('/:id', checkPermission('manage_volunteers'), deleteVolunteer);

export default volunteerRoute;
