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
      // Fetch dynamic permissions from Admin model
      const AdminModel = (await import('../models/Admin.js')).default;
      const adminProfile = await AdminModel.findById(user._id);

      permissionsResponse.permissions = adminProfile?.permissions || [];
      // Admins generally don't view audit/error logs unless they have specific permissions or we decided otherwise
      // For now, let's say 'view_analytics' allows audit logs view in UI if we wanted
      permissionsResponse.canViewAuditLogs = permissionsResponse.permissions.includes('view_analytics');
      permissionsResponse.canViewErrorLogs = false;
      permissionsResponse.canManageAdmins = permissionsResponse.permissions.includes('manage_admins');
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

// Update CNIC images
userRoute.put('/profile/cnic-images', upload.fields([
  { name: 'cnicFrontImage', maxCount: 1 },
  { name: 'cnicBackImage', maxCount: 1 }
]), async (req, res, next) => {
  try {
    const frontImage = req.files?.cnicFrontImage?.[0]?.path;
    const backImage = req.files?.cnicBackImage?.[0]?.path;

    if (!frontImage && !backImage) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one CNIC image'
      });
    }

    const user = await User.findById(req.user.id);

    if (frontImage) user.cnicFrontImage = frontImage;
    if (backImage) user.cnicBackImage = backImage;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'CNIC images updated',
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

    console.log('=== BEFORE SAVE ===');
    console.log('User Phone:', user.phone);
    console.log('User Gender:', user.gender);
    console.log('User CNIC:', user.cnic);
    console.log('User Age:', user.age);
    console.log('User City:', user.city);
    console.log('User Education:', user.education);
    console.log('User Skills:', user.skills);
    console.log('User Modified Paths:', user.modifiedPaths());
    console.log('==================');

    const updatedUser = await user.save();

    console.log('=== AFTER SAVE ===');
    console.log('Updated User ID:', updatedUser._id);
    console.log('Updated User Phone:', updatedUser.phone);
    console.log('Updated User Gender:', updatedUser.gender);
    console.log('Updated User CNIC:', updatedUser.cnic);
    console.log('Updated User Age:', updatedUser.age);
    console.log('Updated User City:', updatedUser.city);
    console.log('Updated User Education:', updatedUser.education);
    console.log('Updated User Skills:', updatedUser.skills);
    console.log('==================');

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
