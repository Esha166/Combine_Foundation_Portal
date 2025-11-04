// Run this script once to create the first Super Admin
// backend/scripts/createSuperAdmin.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import SuperAdmin from '../models/SuperAdmin.js';

dotenv.config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    // Check if super admin already exists
    const existingSuperAdmin = await SuperAdmin.findOne({ role: 'superadmin' });
    
    if (existingSuperAdmin) {
      console.log('Super Admin already exists');
      process.exit(0);
    }

    // Create super admin
    const superAdmin = await SuperAdmin.create({
      name: 'Super Admin',
      email: 'admin@combinefoundation.org', // Change this
      password: 'ChangeMe@123', // Change this immediately after first login
      phone: '+92-XXX-XXXXXXX',
      role: 'superadmin',
      canManageAdmins: true,
      canViewAuditLogs: true,
      isFirstLogin: true
    });

    console.log('Super Admin created successfully');
    console.log('Email:', superAdmin.email);
    console.log('Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

createSuperAdmin();