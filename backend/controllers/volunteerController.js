import Volunteer from "../models/Volunteer.js";
import { generatePassword } from "../utils/generatePassword.js";
import {
  sendApprovalEmail,
  sendRejectionEmail,
  sendInvitationEmail,
} from "../utils/emailService.js";
import { logAuditEvent } from "../utils/auditLogger.js";

export const createVolunteer = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      expertise,
      gender,
      appliedFormId,
      cnic,
      age,
      city,
      education,
      institute,
      socialMedia,
      skills,
      priorExperience,
      experienceDesc,
      availabilityDays,
      availabilityHours,
      termsAgreed
    } = req.body;

    // Check if volunteer already exists
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({
        success: false,
        message: "Volunteer with this email already exists",
      });
    }

    // Generate temporary password
    const tempPassword = generatePassword();

    // Use education from the form if provided, otherwise default to User model's education field
    const volunteer = await Volunteer.create({
      name,
      email,
      phone,
      expertise,
      gender,
      appliedFormId,
      cnic,
      age: age && !isNaN(age) ? parseInt(age, 10) : undefined,
      city,
      education, // This will go to the parent User model
      institute,
      socialMedia,
      skills,
      priorExperience,
      experienceDesc,
      availabilityDays,
      availabilityHours,
      termsAgreed,
      password: tempPassword,
      role: "volunteer",
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Volunteer application received",
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
};

export const approveVolunteer = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id).select('-password');

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    if (volunteer.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Volunteer already approved",
      });
    }

    // Generate new temporary password
    const tempPassword = generatePassword();

    volunteer.status = "approved";
    volunteer.password = tempPassword;
    volunteer.approvedBy = req.user.id;
    volunteer.approvedAt = Date.now();
    await volunteer.save();

    // Send approval email
    await sendApprovalEmail(volunteer, tempPassword);

    // Create audit log
    await logAuditEvent('volunteer_approved', req.user.id, volunteer._id, req.ip);

    res.status(200).json({
      success: true,
      message: "Volunteer approved successfully",
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectVolunteer = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const volunteer = await Volunteer.findById(req.params.id).select('-password');

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }
    volunteer.status = "rejected";
    volunteer.rejectionReason = reason;
    await volunteer.save();

    // Send rejection email
    await sendRejectionEmail(volunteer, reason);

    // Create audit log
    await logAuditEvent('volunteer_rejected', req.user.id, volunteer._id, req.ip, null, { reason });

    res.status(200).json({
      success: true,
      message: "Volunteer rejected",
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
};

export const completeVolunteer = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id).select('-password');

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    if (volunteer.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Only approved volunteers can be marked as completed",
      });
    }

    volunteer.status = "completed";
    await volunteer.save();

    // Create audit log
    await logAuditEvent('volunteer_completed', req.user.id, volunteer._id, req.ip);

    res.status(200).json({
      success: true,
      message: "Volunteer marked as completed",
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingVolunteers = async (req, res, next) => {
  try {
    const volunteers = await Volunteer.find({ status: "pending" })
      .select('-password') // Exclude password field for security
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: volunteers.length,
      data: volunteers,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllVolunteers = async (req, res, next) => {
  try {
    const { status, gender } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (gender) filter.gender = gender;

    const volunteers = await Volunteer.find(filter)
      .select('-password') // Exclude password field for security
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: volunteers.length,
      data: volunteers,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVolunteer = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id).select('-password');
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }

    await volunteer.deleteOne();

    res.status(200).json({
      success: true,
      message: "Volunteer deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Function to invite a new volunteer via email
export const inviteVolunteer = async (req, res, next) => {
  try {
    const { email, name } = req.body;

    // Validate required fields
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "Email and name are required",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Check if volunteer already exists
    const existingVolunteer = await Volunteer.findOne({ email });
    if (existingVolunteer) {
      return res.status(400).json({
        success: false,
        message: "A volunteer with this email already exists",
      });
    }

    // Generate temporary password
    const tempPassword = generatePassword();

    // Create new volunteer with approved status
    const volunteer = await Volunteer.create({
      name,
      email,
      gender: "prefer_not_to_say", // Default value for invited volunteers
      password: tempPassword,
      role: "volunteer",
      status: "approved", // Invited volunteers are automatically approved
      invitedBy: req.user.id, // Track who invited the volunteer
      invitedAt: Date.now(),
    });

    // Send invitation email
    await sendInvitationEmail(volunteer, tempPassword);

    // Create audit log
    await logAuditEvent('volunteer_invited', req.user.id, volunteer._id, req.ip, null, { email: volunteer.email });

    res.status(201).json({
      success: true,
      message: "Volunteer invited successfully",
      data: volunteer,
    });
  } catch (error) {
    next(error);
  }
};
