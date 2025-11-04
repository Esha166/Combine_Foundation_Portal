import Joi from 'joi';

const createTrusteeValidator = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required'
  }),
  education: Joi.string().max(200).optional().messages({
    'string.max': 'Education cannot exceed 200 characters'
  })
});

export {
  createTrusteeValidator
};