import express from 'express';
import { protect } from '../middleware/auth.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { upload } from '../utils/cloudinary.js';
import User from '../models/User.js';

const userRoute = express.Router();

userRoute.use(protect);

// Get user profile
userRoute.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// Get user permissions
userRoute.get('/permissions', async (req, res, next) => {
  try {
    // Populate the complete user document with discriminator-specific fields
    const user = await User.findById(req.user.id);
    
    // Prepare permissions response based on user role
    let permissionsResponse = {
      role: user.role,
      canViewAuditLogs: false,
      canViewErrorLogs: false,
      canManageAdmins: false
    };
    
    // Add role-specific permissions
    if (user.role === 'developer') {
      permissionsResponse.permissions = user.permissions || [];
      permissionsResponse.canViewAuditLogs = user.canViewAuditLogs || false;
      permissionsResponse.canViewErrorLogs = user.canViewErrorLogs || false;
      permissionsResponse.canManageAdmins = user.canManageAdmins || false;
    } else if (user.role === 'superadmin') {
      // Super admins can do everything
      permissionsResponse.permissions = ['full_access'];
      permissionsResponse.canViewAuditLogs = true;
      permissionsResponse.canViewErrorLogs = true;
      permissionsResponse.canManageAdmins = true;
    } else if (user.role === 'admin') {
      permissionsResponse.permissions = ['manage_volunteers', 'manage_courses', 'manage_posts'];
      permissionsResponse.canViewAuditLogs = false;
      permissionsResponse.canViewErrorLogs = false;
      permissionsResponse.canManageAdmins = false; // Only superadmin/developer can manage admins
    } else {
      permissionsResponse.permissions = [];
    }
    
    res.status(200).json({
      success: true,
      data: permissionsResponse
    });
  } catch (error) {
    next(error);
  }
});

// Update profile image
userRoute.put('/profile/image', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const user = await User.findById(req.user.id);
    user.profileImage = req.file.path;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile image updated',
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// Update profile details
userRoute.put('/profile', async (req, res, next) => {
  try {
    const { 
      name, 
      phone, 
      gender, 
      cnic, 
      age, 
      city, 
      education, 
      institute, 
      socialMedia, 
      skills, 
      expertise, 
      priorExperience, 
      experienceDesc, 
      availabilityDays, 
      availabilityHours 
    } = req.body;
    
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (cnic) user.cnic = cnic;
    if (age) user.age = parseInt(age, 10);
    if (city) user.city = city;
    if (education) user.education = education;
    if (institute) user.institute = institute;
    if (socialMedia) user.socialMedia = socialMedia;
    if (skills) user.skills = Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(item => item.trim()) : skills);
    if (expertise) user.expertise = Array.isArray(expertise) ? expertise : (typeof expertise === 'string' ? expertise.split(',').map(item => item.trim()) : expertise);
    if (priorExperience) user.priorExperience = priorExperience;
    if (experienceDesc) user.experienceDesc = experienceDesc;
    if (availabilityDays) user.availabilityDays = Array.isArray(availabilityDays) ? availabilityDays : (typeof availabilityDays === 'string' ? availabilityDays.split(',').map(item => item.trim()) : availabilityDays);
    if (availabilityHours) user.availabilityHours = availabilityHours;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated',
      data: user
    });
  } catch (error) {
    next(error);
  }
});

export default userRoute;