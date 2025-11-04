import AuditLog from '../models/AuditLog.js';

/**
 * Creates an audit log entry
 * @param {string} action - The action that occurred
 * @param {string} performedBy - The user ID who performed the action
 * @param {string} [targetUser] - The target user ID (if applicable)
 * @param {string} [targetResource] - The target resource (if applicable, e.g. "Post:123", "Course:456")
 * @param {string} [ipAddress] - The IP address of the request
 * @param {string} [userAgent] - The user agent of the request
 * @param {Object} [details] - Additional details about the action
 */
export const logAuditEvent = async (action, performedBy, targetUser = null, targetResource = null, ipAddress = null, userAgent = null, details = {}) => {
  try {
    await AuditLog.create({
      action,
      performedBy,
      targetUser: targetUser || undefined,
      targetResource: targetResource || undefined,
      ipAddress: ipAddress || undefined,
      userAgent: userAgent || undefined,
      details: Object.keys(details).length > 0 ? details : undefined
    });
  } catch (error) {
    // Log the error but don't fail the main operation
    console.error('Failed to create audit log:', error.message);
  }
};

export default {
  logAuditEvent
};