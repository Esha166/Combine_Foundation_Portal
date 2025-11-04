export const ROLES = {
  VOLUNTEER: 'volunteer',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
  TRUSTEE: 'trustee'
};

export const VOLUNTEER_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
  PREFER_NOT_TO_SAY: 'prefer_not_to_say'
};

export const EXPERTISE_AREAS = [
  'Education',
  'Healthcare',
  'Technology',
  'Marketing',
  'Finance',
  'Community Development',
  'Environmental Conservation',
  'Youth Development',
  'Women Empowerment',
  'Disaster Relief'
];

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';