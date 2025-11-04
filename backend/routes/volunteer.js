import express from 'express';
import { createVolunteer, getPendingVolunteers, getAllVolunteers, approveVolunteer, rejectVolunteer, deleteVolunteer, inviteVolunteer } from '../controllers/volunteerController.js';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { validate } from '../middleware/validator.js';
import { createVolunteerValidator, rejectVolunteerValidator } from '../validators/volunteerValidator.js';

const volunteerRoute = express.Router();

// Public route (webhook from Google Forms)
volunteerRoute.post('/apply', validate(createVolunteerValidator), createVolunteer);

// Protected routes (admin/superadmin/developer only)
volunteerRoute.use(protect);
volunteerRoute.use(roleCheck('admin', 'superadmin', 'developer'));

volunteerRoute.get('/pending', getPendingVolunteers);
volunteerRoute.get('/', getAllVolunteers);
volunteerRoute.post('/invite', inviteVolunteer); // Route for inviting volunteers
volunteerRoute.post('/:id/approve', approveVolunteer);
volunteerRoute.post('/:id/reject', validate(rejectVolunteerValidator), rejectVolunteer);
volunteerRoute.delete('/:id', deleteVolunteer);

export default volunteerRoute;