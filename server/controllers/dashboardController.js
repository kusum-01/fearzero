export const getDashboardStats = async (req, res, next) => {
  try {
    // Placeholder structure — will be replaced with real aggregation
    // once test/question modules exist.
    const stats = {
      testsCompleted: 0,
      accuracy: 0,
      studyStreak: 0,
      hoursPracticed: 0,
    };

    const recentActivity = [];

    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
        },
        stats,
        recentActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};
