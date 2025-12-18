import Admin from '../models/Admin.js';

/**
 * Middleware to check if the user has a specific permission.
 * Assumes 'protect' middleware has already run and req.user is populated.
 * 
 * @param {String} requiredPermission - The permission string to check (e.g., 'manage_volunteers')
 */
export const checkPermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      // 1. Superadmins and Developers have full access
      if (req.user.role === 'superadmin' || req.user.role === 'developer') {
        return next();
      }

      // 2. If user is not an admin, they shouldn't be here (unless route allows other roles)
      // But if this middleware is used, we assume we want to check for a specific admin permission.
      // 2. Allow Trustees for specific read-only permissions
      if (req.user.role === 'trustee') {
        const allowedPermissions = ['view_analytics', 'view_reports'];
        if (allowedPermissions.includes(requiredPermission)) {
          return next();
        }
        // If trustee tries to access other permissions (like manage_trustees), fall through to denial
      }

      // 3. If user is not an admin (and not superadmin/developer/trustee handled above), deny access
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient privileges.'
        });
      }

      // 3. Fetch the full Admin document to get permissions
      // req.user from 'protect' might be a base User document depending on how it was fetched.
      // Let's fetch the Admin specifically to be sure we have the 'permissions' array.
      const admin = await Admin.findById(req.user._id);

      if (!admin) {
        return res.status(404).json({
          success: false,
          message: 'Admin profile not found.'
        });
      }

      // 4. Check if the admin has the required permission
      if (admin.permissions && admin.permissions.includes(requiredPermission)) {
        return next();
      }

      // 5. Permission denied
      return res.status(403).json({
        success: false,
        message: `Access denied. You need the '${requiredPermission.replace(/_/g, ' ')}' permission.`
      });

    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error during permission check.'
      });
    }
  };
};
