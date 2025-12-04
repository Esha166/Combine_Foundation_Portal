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
    console.log('Update Profile Request Body:', req.body);
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
    console.log('Found User for Update:', user._id, 'Role:', user.role, 'Model:', user.constructor.modelName);

    // Helper to check if value is meaningful (not undefined, not null, not empty string)
    const hasValue = (val) => val !== undefined && val !== null && val !== '';

    if (hasValue(name)) user.name = name;
    if (hasValue(phone)) user.phone = phone;
    if (hasValue(gender)) user.gender = gender;
    if (hasValue(cnic)) user.cnic = cnic;
    
    // Special handling for age - parse and validate
    if (hasValue(age)) {
      const parsedAge = parseInt(age, 10);
      if (!isNaN(parsedAge)) {
        user.age = parsedAge;
      }
    }
    
    if (hasValue(city)) user.city = city;
    if (hasValue(education)) user.education = education;
    if (hasValue(institute)) user.institute = institute;
    if (hasValue(socialMedia)) user.socialMedia = socialMedia;
    
    // Handle arrays - check if they have actual content
    if (skills !== undefined) {
      const skillsArray = Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(item => item.trim()) : []);
      user.skills = skillsArray.filter(s => s); // Remove empty strings
    }
    
    if (expertise !== undefined) {
      const expertiseArray = Array.isArray(expertise) ? expertise : (typeof expertise === 'string' ? expertise.split(',').map(item => item.trim()) : []);
      user.expertise = expertiseArray.filter(e => e); // Remove empty strings
    }
    
    if (hasValue(priorExperience)) user.priorExperience = priorExperience;
    if (hasValue(experienceDesc)) user.experienceDesc = experienceDesc;
    
    if (availabilityDays !== undefined) {
      const daysArray = Array.isArray(availabilityDays) ? availabilityDays : (typeof availabilityDays === 'string' ? availabilityDays.split(',').map(item => item.trim()) : []);
      user.availabilityDays = daysArray.filter(d => d); // Remove empty strings
    }
    
    if (hasValue(availabilityHours)) user.availabilityHours = availabilityHours;

    const updatedUser = await user.save();
    console.log('Updated User:', updatedUser);

    res.status(200).json({
      success: true,
      message: 'Profile updated',
      data: updatedUser
    });
  } catch (error) {
    console.error('Profile Update Error:', error);
    next(error);
  }
});

export default userRoute;