import Joi from 'joi';

const createCourseValidator = Joi.object({
  title: Joi.string().min(5).max(200).required().messages({
    'string.min': 'Title must be at least 5 characters',
    'string.max': 'Title cannot exceed 200 characters',
    'any.required': 'Title is required'
  }),
  subtitle: Joi.string().max(300).optional().allow(''),
  description: Joi.string().max(2000).optional().allow(''),
  registrationLink: Joi.string().uri().optional().allow('').messages({
    'string.uri': 'Please provide a valid URL'
  }),
  socialLink: Joi.string().uri().optional().allow('').messages({
    'string.uri': 'Please provide a valid URL'
  }),
  category: Joi.string().max(150).optional().allow(''),
  duration: Joi.string().max(100).optional().allow(''),
  status: Joi.string().valid('pre-launch', 'launched', 'completed').optional(),
  totalParticipants: Joi.number().integer().min(0).optional(),
  maleParticipants: Joi.number().integer().min(0).optional(),
  femaleParticipants: Joi.number().integer().min(0).optional(),
  isActive: Joi.boolean().optional()
});

const updateCourseValidator = Joi.object({
  title: Joi.string().min(5).max(200).optional(),
  subtitle: Joi.string().max(300).optional().allow(''),
  description: Joi.string().max(2000).optional().allow(''),
  registrationLink: Joi.string().uri().optional().allow(''),
  socialLink: Joi.string().uri().optional().allow(''),
  category: Joi.string().max(150).optional().allow(''),
  duration: Joi.string().max(100).optional().allow(''),
  status: Joi.string().valid('pre-launch', 'launched', 'completed').optional(),
  totalParticipants: Joi.number().integer().min(0).optional(),
  maleParticipants: Joi.number().integer().min(0).optional(),
  femaleParticipants: Joi.number().integer().min(0).optional(),
  isActive: Joi.boolean().optional()
});

export {
  createCourseValidator,
  updateCourseValidator
};
