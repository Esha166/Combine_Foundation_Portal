import User from '../models/User.js';
import IdCard from '../models/IdCard.js';
import { generateUniqueIdNumber } from '../utils/idCardUtils.js';
import Volunteer from '../models/Volunteer.js';
import Trustee from '../models/Trustee.js';
import Admin from '../models/Admin.js';
import SuperAdmin from '../models/SuperAdmin.js';
import Developer from '../models/Developer.js';
import { generateIdCardPDF } from '../utils/pdfGenerator.js';
import { generateQRCode, generateQRCodeURL } from '../utils/qrCodeUtils.js';

const getValidThruByRole = (role, validFrom = new Date()) => {
  const baseDate = new Date(validFrom);
  const monthsToAdd = role === 'volunteer' ? 6 : 12;
  baseDate.setMonth(baseDate.getMonth() + monthsToAdd);
  return baseDate;
};

// Get user ID card information
export const getIdCard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find the user with populated discriminator fields
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get the user's specific role document
    let roleSpecificData = {};
    if (user.role === 'volunteer') {
      const volunteer = await Volunteer.findById(userId);
      if (volunteer) {
        roleSpecificData = {
          expertise: volunteer.expertise,
          cnic: volunteer.cnic
        };
      }
    } else if (user.role === 'trustee') {
      const trustee = await Trustee.findById(userId);
      if (trustee) {
        roleSpecificData = {
          expertise: trustee.expertise
        };
      }
    } else if (user.role === 'admin') {
      const admin = await Admin.findById(userId);
      if (admin) {
        roleSpecificData = {};
      }
    } else if (user.role === 'superadmin') {
      const superadmin = await SuperAdmin.findById(userId);
      if (superadmin) {
        roleSpecificData = {};
      }
    } else if (user.role === 'developer') {
      const developer = await Developer.findById(userId);
      if (developer) {
        roleSpecificData = {};
      }
    }

    // Find existing ID card for the user
    let idCard = await IdCard.findOne({ userId: userId });

    // If no ID card exists, create one
    if (!idCard) {
      const idNumber = await generateUniqueIdNumber(IdCard);

      idCard = await IdCard.create({
        userId: userId,
        idNumber,
        qrCode: generateQRCodeURL('https://combinegrp.com/combine-foundation/'), // Generate QR code with ID card info
        validThru: getValidThruByRole(user.role)
      });
    } else {
      // Check if QR code needs update (for existing users)
      const newQRCode = generateQRCodeURL('https://combinegrp.com/combine-foundation/');
      const expectedValidThru = getValidThruByRole(user.role, idCard.validFrom);
      const needsVolunteerValiditySync =
        user.role === 'volunteer' &&
        new Date(idCard.validThru).getTime() !== expectedValidThru.getTime();

      if (idCard.qrCode !== newQRCode || needsVolunteerValiditySync) {
        idCard.qrCode = newQRCode;
        if (needsVolunteerValiditySync) {
          idCard.validThru = expectedValidThru;
        }
        await idCard.save();
      }
    }

    // Combine user data with role-specific data and ID card info
    const idCardData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
        education: user.education,
        expertise: roleSpecificData.expertise || null,
        cnic: roleSpecificData.cnic || null,
        createdAt: user.createdAt
      },
      idCard: {
        idNumber: idCard.idNumber,
        isValid: idCard.isValid,
        validFrom: idCard.validFrom,
        validThru: idCard.validThru,
        issuedAt: idCard.issuedAt,
        qrCode: idCard.qrCode
      }
    };

    res.status(200).json({
      success: true,
      data: idCardData
    });
  } catch (error) {
    next(error);
  }
};

// Generate new ID card if needed
export const generateIdCard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find existing ID card for the user
    let idCard = await IdCard.findOne({ userId: userId });

    if (idCard) {
      // If ID card exists, update its validity dates
      idCard.validFrom = new Date();
      idCard.validThru = getValidThruByRole(req.user.role, idCard.validFrom);
      idCard.issuedAt = new Date();
      // Update QR code to ensure it points to the new URL
      idCard.qrCode = generateQRCodeURL('https://combinegrp.com/combine-foundation/');
      await idCard.save();
    } else {
      // Create new ID card
      const idNumber = await generateUniqueIdNumber(IdCard);

      idCard = await IdCard.create({
        userId: userId,
        idNumber,
        qrCode: generateQRCodeURL('https://combinegrp.com/combine-foundation/'),
        validThru: getValidThruByRole(req.user.role)
      });
    }

    res.status(200).json({
      success: true,
      message: 'ID card generated successfully',
      data: { idCard }
    });
  } catch (error) {
    next(error);
  }
};

// Update ID card validity
export const updateIdCardValidity = async (req, res, next) => {
  try {
    const { idCardId } = req.params;
    const { isValid } = req.body;

    const idCard = await IdCard.findByIdAndUpdate(
      idCardId,
      { isValid },
      { new: true, runValidators: true }
    );

    if (!idCard) {
      return res.status(404).json({
        success: false,
        message: 'ID card not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { idCard }
    });
  } catch (error) {
    next(error);
  }
};

// Download ID card as PDF
export const downloadIdCard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find the user with populated discriminator fields
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get the user's specific role document
    let roleSpecificData = {};
    if (user.role === 'volunteer') {
      const volunteer = await Volunteer.findById(userId);
      if (volunteer) {
        roleSpecificData = {
          expertise: volunteer.expertise,
          cnic: volunteer.cnic
        };
      }
    } else if (user.role === 'trustee') {
      const trustee = await Trustee.findById(userId);
      if (trustee) {
        roleSpecificData = {
          expertise: trustee.expertise
        };
      }
    } else if (user.role === 'admin') {
      const admin = await Admin.findById(userId);
      if (admin) {
        roleSpecificData = {};
      }
    } else if (user.role === 'superadmin') {
      const superadmin = await SuperAdmin.findById(userId);
      if (superadmin) {
        roleSpecificData = {};
      }
    } else if (user.role === 'developer') {
      const developer = await Developer.findById(userId);
      if (developer) {
        roleSpecificData = {};
      }
    }

    // Find or create ID card for the user
    let idCard = await IdCard.findOne({ userId: userId });
    if (!idCard) {
      const idNumber = await generateUniqueIdNumber(IdCard);

      idCard = await IdCard.create({
        userId: userId,
        idNumber,
        qrCode: generateQRCodeURL('https://combinegrp.com/combine-foundation/'),
        validThru: getValidThruByRole(user.role)
      });
    } else {
      // Check if QR code needs update (for existing users)
      const newQRCode = generateQRCodeURL('https://combinegrp.com/combine-foundation/');
      const expectedValidThru = getValidThruByRole(user.role, idCard.validFrom);
      const needsVolunteerValiditySync =
        user.role === 'volunteer' &&
        new Date(idCard.validThru).getTime() !== expectedValidThru.getTime();

      if (idCard.qrCode !== newQRCode || needsVolunteerValiditySync) {
        idCard.qrCode = newQRCode;
        if (needsVolunteerValiditySync) {
          idCard.validThru = expectedValidThru;
        }
        await idCard.save();
      }
    }

    // Prepare user data for PDF
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profileImage: user.profileImage,
      role: user.role,
      education: user.education,
      expertise: roleSpecificData.expertise || null,
      cnic: roleSpecificData.cnic || null,
      createdAt: user.createdAt
    };

    const idCardData = {
      idNumber: idCard.idNumber,
      isValid: idCard.isValid,
      validFrom: idCard.validFrom,
      validThru: idCard.validThru,
      issuedAt: idCard.issuedAt,
      qrCode: idCard.qrCode
    };

    // Generate PDF
    const pdfBuffer = await generateIdCardPDF(userData, idCardData);

    // Update download count
    idCard.downloadCount += 1;
    idCard.lastDownloadedAt = new Date();
    await idCard.save();

    // Send PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="id-card-${user.name.replace(/\s+/g, '_')}-${idCard.idNumber}.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
