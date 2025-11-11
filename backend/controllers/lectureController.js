import Lecture from '../models/Lecture.js';
import User from '../models/User.js';
import { isValidObjectId } from 'mongoose';

// Get all lectures (for public view and authorized users)
export const getLectures = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    
    // Build filter object
    let filter = { isActive: true };
    
    // If user is authenticated and not admin/superadmin/developer, only show public lectures
    if (req.user && !['admin', 'superadmin', 'developer'].includes(req.user.role)) {
      filter.isPublic = true;
    } else if (!req.user) {
      // For unauthenticated users, only show public lectures
      filter.isPublic = true;
    }
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const lectures = await Lecture.find(filter)
      .populate('author', 'name email profileImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Lecture.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: {
        lectures,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalLectures: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single lecture by ID
export const getLecture = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lecture ID'
      });
    }
    
    const lecture = await Lecture.findById(id).populate('author', 'name email profileImage');
    
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }
    
    // Check if user can access this lecture
    if (!lecture.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }
    
    // If user is authenticated and not admin/superadmin/developer, check if it's public
    if (req.user && !['admin', 'superadmin', 'developer'].includes(req.user.role) && !lecture.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this lecture'
      });
    } else if (!req.user && !lecture.isPublic) {
      // For unauthenticated users, only allow access to public lectures
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this lecture'
      });
    }
    
    // Increment view count
    lecture.views = (lecture.views || 0) + 1;
    await lecture.save();
    
    res.status(200).json({
      success: true,
      data: lecture
    });
  } catch (error) {
    next(error);
  }
};

// Create new lecture (only for admin, superadmin, developer)
export const createLecture = async (req, res, next) => {
  try {
    const { title, subtitle, watchLink, description, category, tags, duration, isPublic } = req.body;
    
    // Validate required fields
    if (!title || !watchLink) {
      return res.status(400).json({
        success: false,
        message: 'Title and watch link are required'
      });
    }

    // If there's no thumbnail file, we need a thumbnail URL
    if (!req.file && !req.body.thumbnail) {
      return res.status(400).json({
        success: false,
        message: 'Thumbnail is required (either upload a file or provide a URL)'
      });
    }
    
    // Validate URL
    try {
      new URL(watchLink);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid watch link URL'
      });
    }
    
    let thumbnailUrl = req.body.thumbnail || '';
    
    // If a file was uploaded, use its URL from Cloudinary
    if (req.file) {
      thumbnailUrl = req.file.path;
    }

    const lecture = await Lecture.create({
      title,
      subtitle,
      thumbnail: thumbnailUrl,
      watchLink,
      description,
      category,
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : []),
      duration,
      isPublic: isPublic !== undefined ? isPublic : true,
      author: req.user.id
    });
    
    res.status(201).json({
      success: true,
      message: 'Lecture created successfully',
      data: lecture
    });
  } catch (error) {
    next(error);
  }
};

// Update lecture (only for admin, superadmin, developer)
export const updateLecture = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, subtitle, thumbnail, watchLink, description, category, tags, duration, isActive, isPublic } = req.body;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lecture ID'
      });
    }
    
    const lecture = await Lecture.findById(id);
    
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }
    
    // Check if user can update this lecture
    if (!['admin', 'superadmin', 'developer'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this lecture'
      });
    }
    
    // Update fields if provided
    if (title !== undefined) lecture.title = title;
    if (subtitle !== undefined) lecture.subtitle = subtitle;
    
    // Handle thumbnail: use uploaded file if available, otherwise use provided URL
    if (req.file) {
      lecture.thumbnail = req.file.path;
    } else if (req.body.thumbnail !== undefined) {
      lecture.thumbnail = req.body.thumbnail;
    }
    if (watchLink !== undefined) {
      // Validate URL
      try {
        new URL(watchLink);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid watch link URL'
        });
      }
      lecture.watchLink = watchLink;
    }
    if (description !== undefined) lecture.description = description;
    if (category !== undefined) lecture.category = category;
    if (tags !== undefined) lecture.tags = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : []);
    if (duration !== undefined) lecture.duration = duration;
    if (isActive !== undefined) lecture.isActive = isActive;
    if (isPublic !== undefined) lecture.isPublic = isPublic;
    
    await lecture.save();
    
    res.status(200).json({
      success: true,
      message: 'Lecture updated successfully',
      data: lecture
    });
  } catch (error) {
    next(error);
  }
};

// Delete lecture (only for admin, superadmin, developer)
export const deleteLecture = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lecture ID'
      });
    }
    
    const lecture = await Lecture.findById(id);
    
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }
    
    // Check if user can delete this lecture
    if (!['admin', 'superadmin', 'developer'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this lecture'
      });
    }
    
    await Lecture.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Lecture deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Toggle lecture status (active/inactive)
export const toggleLectureStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid lecture ID'
      });
    }
    
    const lecture = await Lecture.findById(id);
    
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: 'Lecture not found'
      });
    }
    
    // Check if user can update this lecture
    if (!['admin', 'superadmin', 'developer'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this lecture'
      });
    }
    
    lecture.isActive = !lecture.isActive;
    await lecture.save();
    
    res.status(200).json({
      success: true,
      message: `Lecture ${lecture.isActive ? 'activated' : 'deactivated'} successfully`,
      data: lecture
    });
  } catch (error) {
    next(error);
  }
};

// Get lectures by author
export const getLecturesByAuthor = async (req, res, next) => {
  try {
    const { authorId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Build filter object
    let filter = { author: authorId, isActive: true };
    
    // If user is authenticated and not admin/superadmin/developer, only show public lectures
    if (req.user && !['admin', 'superadmin', 'developer'].includes(req.user.role)) {
      filter.isPublic = true;
    } else if (!req.user) {
      // For unauthenticated users, only show public lectures
      filter.isPublic = true;
    }
    
    const lectures = await Lecture.find(filter)
      .populate('author', 'name email profileImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Lecture.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: {
        lectures,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalLectures: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get lectures by category
export const getLecturesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Build filter object
    let filter = { 
      category, 
      isActive: true 
    };
    
    // If user is authenticated and not admin/superadmin/developer, only show public lectures
    if (req.user && !['admin', 'superadmin', 'developer'].includes(req.user.role)) {
      filter.isPublic = true;
    } else if (!req.user) {
      // For unauthenticated users, only show public lectures
      filter.isPublic = true;
    }
    
    const lectures = await Lecture.find(filter)
      .populate('author', 'name email profileImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Lecture.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      data: {
        lectures,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalLectures: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};