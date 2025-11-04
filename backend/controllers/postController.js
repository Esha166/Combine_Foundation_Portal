import Post from '../models/Post.js';
import { deleteImage, validateCloudinaryConfig } from '../utils/cloudinary.js';
import { logAuditEvent } from '../utils/auditLogger.js';

export const createPost = async (req, res, next) => {
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

    const { title, subtitle, content, socialLink } = req.body;

    // Check if file was uploaded successfully
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Post image is required. Please make sure the image field is named "image" and the file is less than 5MB.'
      });
    }

    const post = await Post.create({
      title,
      subtitle,
      content,
      imageUrl: req.file.path,
      socialLink,
      createdBy: req.user.id
    });

    // Create audit log
    await logAuditEvent('post_created', req.user.id, null, `Post:${post._id}`, req.ip);

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPosts = async (req, res, next) => {
  try {
    const { isPublished } = req.query;
    const filter = {};

    if (isPublished !== undefined) {
      filter.isPublished = isPublished === 'true';
    }

    const posts = await Post.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts
    });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
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

    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const { title, subtitle, content, socialLink, isPublished } = req.body;

    // Update fields
    if (title) post.title = title;
    if (subtitle) post.subtitle = subtitle;
    if (content) post.content = content;
    if (socialLink) post.socialLink = socialLink;
    if (isPublished !== undefined) post.isPublished = isPublished;

    // Update image if new one provided
    if (req.file) {
      // Delete old image from Cloudinary
      const publicId = post.imageUrl.split('/').pop().split('.')[0];
      await deleteImage(`combine-foundation/${publicId}`);
      
      post.imageUrl = req.file.path;
    }

    await post.save();

    // Create audit log
    await logAuditEvent('post_updated', req.user.id, null, `Post:${post._id}`, req.ip);

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Delete image from Cloudinary
    const publicId = post.imageUrl.split('/').pop().split('.')[0];
    await deleteImage(`combine-foundation/${publicId}`);

    await post.deleteOne();

    // Create audit log
    await logAuditEvent('post_deleted', req.user.id, null, `Post:${post._id}`, req.ip);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};