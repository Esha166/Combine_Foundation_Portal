import Volunteer from "../models/Volunteer.js";
import Course from "../models/Course.js";
import Post from "../models/Post.js";
import User from "../models/User.js";

export const getStats = async (req, res, next) => {
  try {
    // Use base users collection for trustee totals to include all volunteer records
    const totalVolunteers = await User.countDocuments({ role: "volunteer" });

    // Get volunteers by gender (all volunteer users)
    const maleVolunteers = await User.countDocuments({
      role: "volunteer",
      gender: "male",
    });

    const femaleVolunteers = await User.countDocuments({
      role: "volunteer",
      gender: "female",
    });

    const otherVolunteers = await User.countDocuments({
      role: "volunteer",
      gender: { $in: ["other", "prefer_not_to_say", null] },
    });

    // Volunteer counts by status (all volunteer users)
    const volunteerStatusStats = await User.aggregate([
      {
        $match: { role: "volunteer" },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const volunteerStatusCounts = volunteerStatusStats.reduce(
      (acc, item) => {
        acc[item._id] = item.count;
        return acc;
      },
      {
        pending: 0,
        approved: 0,
        rejected: 0,
        completed: 0,
      }
    );

    // Get total courses
    const totalCourses = await Course.countDocuments({ isActive: true });
    const totalCompletedCourses = await Course.countDocuments({
      isActive: true,
      status: "completed",
    });

    // Get total posts
    const totalPosts = await Post.countDocuments({ isPublished: true });

    // Get monthly volunteer registrations (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRegistrations = await Volunteer.aggregate([
      {
        $match: {
          status: "approved",
          approvedAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$approvedAt" },
            month: { $month: "$approvedAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Completion rate derived from course status
    const completionRate = totalCourses > 0
      ? (totalCompletedCourses / totalCourses) * 100
      : 0;

    // Volunteers by expertise area
    const volunteersByExpertise = await Volunteer.aggregate([
      {
        $match: { status: "approved" }
      },
      {
        $unwind: "$expertise"
      },
      {
        $group: {
          _id: "$expertise",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Recent activity stats (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActivities = await Volunteer.countDocuments({
      status: "approved",
      updatedAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        volunteers: {
          total: totalVolunteers,
          male: maleVolunteers,
          female: femaleVolunteers,
          other: otherVolunteers,
          pending: volunteerStatusCounts.pending,
          approved: volunteerStatusCounts.approved,
          rejected: volunteerStatusCounts.rejected,
          completed: volunteerStatusCounts.completed,
          active: recentActivities, // Volunteers active in last 30 days
        },
        courses: {
          total: totalCourses,
          completed: totalCompletedCourses,
          avgPerVolunteer: Math.round(completionRate * 100) / 100,
        },
        posts: {
          total: totalPosts,
        },
        monthlyRegistrations,
        expertiseDistribution: volunteersByExpertise,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getVolunteersByExpertise = async (req, res, next) => {
  try {
    const expertiseStats = await Volunteer.aggregate([
      {
        $match: { status: "approved" },
      },
      {
        $unwind: "$expertise",
      },
      {
        $group: {
          _id: "$expertise",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: expertiseStats,
    });
  } catch (error) {
    next(error);
  }
};

export const getDetailedReports = async (req, res, next) => {
  try {
    // Get volunteers with detailed information
    const volunteers = await Volunteer.find({ status: "approved" })
      .select("name email gender expertise status createdAt completedCourses")
      .populate({
        path: "completedCourses.courseId",
        select: "title description courseType"
      });

    // Calculate course completion statistics
    const courseCompletionStats = await Volunteer.aggregate([
      {
        $match: { status: "approved" }
      },
      {
        $project: {
          completedCourses: { $size: { $ifNull: ["$completedCourses", []] } }
        }
      },
      {
        $group: {
          _id: null,
          totalCoursesCompleted: { $sum: "$completedCourses" },
          avgCoursesPerVolunteer: { $avg: "$completedCourses" },
          volunteersWithCourses: { $sum: { $cond: [{ $gt: ["$completedCourses", 0] }, 1, 0] } }
        }
      }
    ]);

    const completionStats = courseCompletionStats[0] || {
      totalCoursesCompleted: 0,
      avgCoursesPerVolunteer: 0,
      volunteersWithCourses: 0
    };

    // Get course completion by type (if courseType exists in Course model)
    const courseTypeStats = await Volunteer.aggregate([
      {
        $match: { status: "approved", completedCourses: { $exists: true, $ne: [] } }
      },
      { $unwind: "$completedCourses" },
      {
        $lookup: {
          from: "courses", // Assuming course collection name
          localField: "completedCourses.courseId",
          foreignField: "_id",
          as: "courseDetails"
        }
      },
      { $unwind: "$courseDetails" },
      { $group: { _id: "$courseDetails.courseType", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get monthly activity data
    const monthlyActivity = await Volunteer.aggregate([
      {
        $match: { status: "approved" }
      },
      {
        $group: {
          _id: {
            month: { $month: "$updatedAt" },
            year: { $year: "$updatedAt" }
          },
          activeVolunteers: { $sum: 1 },
          newVolunteers: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] } }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        volunteerCount: volunteers.length,
        volunteers: volunteers,
        courseCompletionStats: completionStats,
        courseTypeStats,
        monthlyActivity
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all admin and volunteer members
export const getMembers = async (req, res, next) => {
  try {
    // Get all users with role 'admin' or 'volunteer'
    const members = await User.find({
      role: { $in: ['admin', 'volunteer'] }
    }).select('name email role isActive createdAt status gender');

    // Separate into admins and volunteers
    const admins = members.filter(user => user.role === 'admin');
    const volunteers = members.filter(user => user.role === 'volunteer');

    const volunteerGenderCounts = volunteers.reduce(
      (acc, volunteer) => {
        if (volunteer.gender === 'male') acc.male += 1;
        else if (volunteer.gender === 'female') acc.female += 1;
        else acc.other += 1;
        return acc;
      },
      { male: 0, female: 0, other: 0 }
    );

    const volunteerStatusCounts = volunteers.reduce(
      (acc, volunteer) => {
        const status = volunteer.status || 'unknown';
        if (status === 'pending' || status === 'approved' || status === 'rejected' || status === 'completed') {
          acc[status] += 1;
        } else {
          acc.unknown += 1;
        }
        return acc;
      },
      { pending: 0, approved: 0, rejected: 0, completed: 0, unknown: 0 }
    );

    res.status(200).json({
      success: true,
      data: {
        admins,
        volunteers,
        totalCount: members.length,
        volunteerCounts: {
          total: volunteers.length,
          ...volunteerGenderCounts,
          ...volunteerStatusCounts
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all published posts
export const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ isPublished: true })
      .select('title content createdBy createdAt updatedAt isPublished')
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        posts,
        totalCount: posts.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all active courses
export const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ isActive: true })
      .select('title description category duration status totalParticipants maleParticipants femaleParticipants isActive createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        courses,
        totalCount: courses.length
      }
    });
  } catch (error) {
    next(error);
  }
};
