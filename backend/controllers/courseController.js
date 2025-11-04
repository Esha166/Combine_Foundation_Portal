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

    const { title, subtitle, description, registrationLink, socialLink } = req.body;

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

    const { title, subtitle, description, registrationLink, socialLink, isActive } = req.body;

    // Update fields
    if (title) course.title = title;
    if (subtitle) course.subtitle = subtitle;
    if (description) course.description = description;
    if (registrationLink) course.registrationLink = registrationLink;
    if (socialLink) course.socialLink = socialLink;
    if (isActive !== undefined) course.isActive = isActive;

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
