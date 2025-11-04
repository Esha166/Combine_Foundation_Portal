import Joi from 'joi';

const createVolunteerValidator = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional().messages({
    'string.pattern.base': 'Please provide a valid phone number'
  }),
  gender: Joi.string().valid('male', 'female', 'other', 'prefer_not_to_say').required().messages({
    'any.only': 'Gender must be male, female, other, or prefer_not_to_say',
    'any.required': 'Gender is required'
  }),
  expertise: Joi.array().items(Joi.string()).optional(),
  appliedFormId: Joi.string().optional(),
  cnic: Joi.string().allow('').optional().messages({
    'string.max': 'CNIC cannot exceed 100 characters'
  }),
  age: Joi.string().pattern(/^[0-9]{1,3}$/).allow('').optional().messages({
    'string.pattern.base': 'Age must be a valid number between 13 and 100',
    'string.max': 'Age is too long'
  }),
  city: Joi.string().allow('').optional().messages({
    'string.max': 'City name is too long'
  }),
  education: Joi.string().allow('').optional().messages({
    'string.max': 'Education information is too long'
  }),
  institute: Joi.string().allow('').optional().messages({
    'string.max': 'Institute name is too long'
  }),
  socialMedia: Joi.string().allow('').optional().messages({
    'string.max': 'Social media link is too long'
  }),
  skills: Joi.array().items(Joi.string()).optional(),
  priorExperience: Joi.string().allow('').optional().messages({
    'string.max': 'Prior experience information is too long'
  }),
  experienceDesc: Joi.string().allow('').optional().messages({
    'string.max': 'Experience description is too long'
  }),
  availabilityDays: Joi.array().items(Joi.string()).optional(),
  availabilityHours: Joi.string().allow('').optional().messages({
    'string.max': 'Availability hours format is too long'
  }),
  termsAgreed: Joi.boolean().required().messages({
    'any.required': 'You must agree to the terms and conditions',
    'boolean.base': 'Terms agreement must be true or false'
  })
});

const rejectVolunteerValidator = Joi.object({
  reason: Joi.string().min(10).max(500).required().messages({
    'string.min': 'Rejection reason must be at least 10 characters',
    'string.max': 'Rejection reason cannot exceed 500 characters',
    'any.required': 'Rejection reason is required'
  })
});

export {
  createVolunteerValidator,
  rejectVolunteerValidator
};