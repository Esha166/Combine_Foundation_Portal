import AuditLog from '../models/AuditLog.js';
import ErrorLog from '../models/ErrorLog.js';

// Get audit logs with pagination and filtering - developer only
export const getAuditLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Filtering options
    const filter = {};
    
    if (req.query.action) {
      filter.action = req.query.action;
    }
    
    if (req.query.performedBy) {
      filter.performedBy = req.query.performedBy;
    }
    
    if (req.query.startDate) {
      if (!filter.timestamp) filter.timestamp = {};
      filter.timestamp.$gte = new Date(req.query.startDate);
    }
    
    if (req.query.endDate) {
      if (!filter.timestamp) filter.timestamp = {};
      filter.timestamp.$lte = new Date(req.query.endDate);
    }

    // If not filtering by specific user, only show for developers and superadmins
    if (!filter.performedBy && req.user.role !== 'developer' && req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access to audit logs is restricted to developers and superadmins'
      });
    }

    const total = await AuditLog.countDocuments(filter);
    const logs = await AuditLog.find(filter)
      .populate('performedBy', 'name email role')
      .populate('targetUser', 'name email role')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        logs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalLogs: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get error logs with pagination and filtering - developer only
export const getErrorLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Filtering options
    const filter = {};
    
    if (req.query.level) {
      filter.level = req.query.level;
    }
    
    if (req.query.startDate) {
      if (!filter.timestamp) filter.timestamp = {};
      filter.timestamp.$gte = new Date(req.query.startDate);
    }
    
    if (req.query.endDate) {
      if (!filter.timestamp) filter.timestamp = {};
      filter.timestamp.$lte = new Date(req.query.endDate);
    }

    if (req.query.userId) {
      filter.userId = req.query.userId;
    }

    if (req.query.source) {
      filter.source = req.query.source;
    }

    const total = await ErrorLog.countDocuments(filter);
    const logs = await ErrorLog.find(filter)
      .populate('userId', 'name email role')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: {
        logs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalLogs: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Clear old audit logs - developer only
export const clearAuditLogs = async (req, res, next) => {
  try {
    const { beforeDate } = req.body;

    if (!beforeDate) {
      return res.status(400).json({
        success: false,
        message: 'beforeDate is required to clear audit logs'
      });
    }

    const deleteResult = await AuditLog.deleteMany({
      timestamp: { $lt: new Date(beforeDate) }
    });

    res.status(200).json({
      success: true,
      message: `${deleteResult.deletedCount} audit logs cleared successfully`
    });
  } catch (error) {
    next(error);
  }
};

// Clear old error logs - developer only
export const clearErrorLogs = async (req, res, next) => {
  try {
    const { beforeDate } = req.body;

    if (!beforeDate) {
      return res.status(400).json({
        success: false,
        message: 'beforeDate is required to clear error logs'
      });
    }

    const deleteResult = await ErrorLog.deleteMany({
      timestamp: { $lt: new Date(beforeDate) }
    });

    res.status(200).json({
      success: true,
      message: `${deleteResult.deletedCount} error logs cleared successfully`
    });
  } catch (error) {
    next(error);
  }
};

// Get audit log statistics - developer only
export const getAuditLogStats = async (req, res, next) => {
  try {
    const stats = await AuditLog.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const totalLogs = await AuditLog.countDocuments();
    
    // Get recent logs
    const recentLogs = await AuditLog.find()
      .populate('performedBy', 'name email role')
      .sort({ timestamp: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalLogs,
        actionStats: stats,
        recentLogs
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get error log statistics - developer only
export const getErrorLogStats = async (req, res, next) => {
  try {
    const stats = await ErrorLog.aggregate([
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const totalLogs = await ErrorLog.countDocuments();
    
    // Get recent error logs
    const recentLogs = await ErrorLog.find({ level: 'error' })
      .populate('userId', 'name email role')
      .sort({ timestamp: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        totalLogs,
        levelStats: stats,
        recentErrorLogs: recentLogs
      }
    });
  } catch (error) {
    next(error);
  }
};