import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Create a custom storage that initializes Cloudinary only when needed
class ConditionalCloudinaryStorage {
  constructor(options) {
    this.options = options;
    this.cloudinaryInitialized = false;
  }

  _handleFile(req, file, cb) {
    // Initialize Cloudinary if not already done and if environment variables are available
    if (!this.cloudinaryInitialized) {
      const cloudinaryConfig = {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      };

      if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
        console.error('Missing required Cloudinary environment variables!');
        console.error('Missing variables:', {
          CLOUDINARY_CLOUD_NAME: !cloudinaryConfig.cloud_name,
          CLOUDINARY_API_KEY: !cloudinaryConfig.api_key,
          CLOUDINARY_API_SECRET: !cloudinaryConfig.api_secret
        });
        return cb(new Error('Cloudinary configuration is missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.'));
      }
      
      console.log('Cloudinary environment variables found, initializing...');
      cloudinary.config(cloudinaryConfig);
      this.cloudinaryInitialized = true;
    }

    // Now create the actual CloudinaryStorage
    const actualStorage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'combine-foundation',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 800, height: 800, crop: 'limit' }]
      }
    });

    // Call the actual storage's _handleFile method
    actualStorage._handleFile(req, file, cb);
  }

  _removeFile(req, file, cb) {
    // Initialize Cloudinary if not already done
    if (!this.cloudinaryInitialized) {
      const cloudinaryConfig = {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      };

      if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
        return cb(new Error('Cloudinary configuration is missing for file removal.'));
      }
      
      cloudinary.config(cloudinaryConfig);
      this.cloudinaryInitialized = true;
    }

    // Now create the actual CloudinaryStorage
    const actualStorage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'combine-foundation',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 800, height: 800, crop: 'limit' }]
      }
    });

    actualStorage._removeFile(req, file, cb);
  }
}

// Create upload with conditional storage
const upload = multer({ 
  storage: new ConditionalCloudinaryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Check if file type is an image
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    
    cb(null, true);
  }
});

// Add validation function to check if Cloudinary is properly configured
const validateCloudinaryConfig = () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error('Missing CLOUDINARY_CLOUD_NAME environment variable');
    throw new Error('Missing CLOUDINARY_CLOUD_NAME environment variable');
  }
  if (!process.env.CLOUDINARY_API_KEY) {
    console.error('Missing CLOUDINARY_API_KEY environment variable');
    throw new Error('Missing CLOUDINARY_API_KEY environment variable');
  }
  if (!process.env.CLOUDINARY_API_SECRET) {
    console.error('Missing CLOUDINARY_API_SECRET environment variable');
    throw new Error('Missing CLOUDINARY_API_SECRET environment variable');
  }
};

const deleteImage = async (publicId) => {
  // Initialize Cloudinary if needed
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Missing required Cloudinary environment variables for delete operation!');
    throw new Error('Cloudinary configuration is missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.');
  }

  const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  };
  
  cloudinary.config(cloudinaryConfig);

  try {
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export { upload, deleteImage, cloudinary, validateCloudinaryConfig };