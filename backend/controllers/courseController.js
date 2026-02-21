import Course from '../models/Course.js';
import {deleteImage, validateCloudinaryConfig} from '../utils/cloudinary.js';
import { logAuditEvent } from '../utils/auditLogger.js';

export const createCourse = async (req, res, next) => {
  try {
    // Validate Cloudinary configuration before proceeding
    try {
      validateCloudinaryConfig();
    } catch (configError) {
      console.error('Cloudinary configuration error:', configError.message);
      return res.status(500).json({
        success: false,
        message: 'Server configuration error. Please contact the administrator.'
      });
    }

    const {
      title,
      subtitle,
      description,
      registrationLink,
      socialLink,
      category,
      duration,
      status,
      totalParticipants,
      maleParticipants,
      femaleParticipants
    } = req.body;

    const parsedTotalParticipants = totalParticipants !== undefined && totalParticipants !== ''
      ? Number(totalParticipants)
      : 0;
    const parsedMaleParticipants = maleParticipants !== undefined && maleParticipants !== ''
      ? Number(maleParticipants)
      : 0;
    const parsedFemaleParticipants = femaleParticipants !== undefined && femaleParticipants !== ''
      ? Number(femaleParticipants)
      : 0;

    if (
      status === 'completed' &&
      (Number.isNaN(parsedTotalParticipants) || Number.isNaN(parsedMaleParticipants) || Number.isNaN(parsedFemaleParticipants))
    ) {
      return res.status(400).json({
        success: false,
        message: 'Participants fields must be valid numbers'
      });
    }

    if (status === 'completed' && parsedTotalParticipants < parsedMaleParticipants + parsedFemaleParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Total participants cannot be less than male + female participants'
      });
    }

    // Check if file was uploaded successfully
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Course image is required. Please make sure the image field is named "image" and the file is less than 5MB.'
      });
    }

    const course = await Course.create({
      title,
      subtitle,
      description,
      imageUrl: req.file.path,
      registrationLink,
      socialLink,
      category,
      duration,
      status,
      totalParticipants: status === 'completed' ? parsedTotalParticipants : 0,
      maleParticipants: status === 'completed' ? parsedMaleParticipants : 0,
      femaleParticipants: status === 'completed' ? parsedFemaleParticipants : 0,
      createdBy: req.user.id
    });

    // Create audit log
    await logAuditEvent('course_created', req.user.id, null, `Course:${course._id}`, req.ip);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCourses = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    const filter = {};

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const courses = await Course.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

export const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

export const updateCourse = async (req, res, next) => {
  try {
    // Validate Cloudinary configuration before proceeding if updating image
    if (req.file) {
      try {
        validateCloudinaryConfig();
      } catch (configError) {
        console.error('Cloudinary configuration error:', configError.message);
        return res.status(500).json({
          success: false,
          message: 'Server configuration error. Please contact the administrator.'
        });
      }
    }

    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const {
      title,
      subtitle,
      description,
      registrationLink,
      socialLink,
      category,
      duration,
      status,
      totalParticipants,
      maleParticipants,
      femaleParticipants,
      isActive
    } = req.body;

    // Update fields
    if (title !== undefined) course.title = title;
    if (subtitle !== undefined) course.subtitle = subtitle;
    if (description !== undefined) course.description = description;
    if (registrationLink !== undefined) course.registrationLink = registrationLink;
    if (socialLink !== undefined) course.socialLink = socialLink;
    if (category !== undefined) course.category = category;
    if (duration !== undefined) course.duration = duration;
    if (status !== undefined) course.status = status;
    if (isActive !== undefined) course.isActive = isActive;

    const parsedTotalParticipants = totalParticipants !== undefined && totalParticipants !== ''
      ? Number(totalParticipants)
      : course.totalParticipants || 0;
    const parsedMaleParticipants = maleParticipants !== undefined && maleParticipants !== ''
      ? Number(maleParticipants)
      : course.maleParticipants || 0;
    const parsedFemaleParticipants = femaleParticipants !== undefined && femaleParticipants !== ''
      ? Number(femaleParticipants)
      : course.femaleParticipants || 0;

    if (
      course.status === 'completed' &&
      (Number.isNaN(parsedTotalParticipants) || Number.isNaN(parsedMaleParticipants) || Number.isNaN(parsedFemaleParticipants))
    ) {
      return res.status(400).json({
        success: false,
        message: 'Participants fields must be valid numbers'
      });
    }

    if (course.status === 'completed' && parsedTotalParticipants < parsedMaleParticipants + parsedFemaleParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Total participants cannot be less than male + female participants'
      });
    }

    if (course.status === 'completed') {
      course.totalParticipants = parsedTotalParticipants;
      course.maleParticipants = parsedMaleParticipants;
      course.femaleParticipants = parsedFemaleParticipants;
    } else {
      course.totalParticipants = 0;
      course.maleParticipants = 0;
      course.femaleParticipants = 0;
    }

    // Update image if new one provided
    if (req.file) {
      // Delete old image from Cloudinary
      const publicId = course.imageUrl.split('/').pop().split('.')[0];
      await deleteImage(`combine-foundation/${publicId}`);
      
      course.imageUrl = req.file.path;
    }

    await course.save();

    // Create audit log
    await logAuditEvent('course_updated', req.user.id, null, `Course:${course._id}`, req.ip);

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Delete image from Cloudinary
    const publicId = course.imageUrl.split('/').pop().split('.')[0];
    await deleteImage(`combine-foundation/${publicId}`);

    await course.deleteOne();

    // Create audit log
    await logAuditEvent('course_deleted', req.user.id, null, `Course:${course._id}`, req.ip);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
