import {
  getLatestScores,
  computeReadinessScore,
  getResumeScoreHistory,
  getInterviewHistory,
  getGdHistory,
  getSkillRadarData,
  getWeeklyProgress,
  getActivityTimeline,
  getRecentFeedback,
  getRecommendations,
} from '../services/analyticsService.js';

export const getOverview = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const scores = await getLatestScores(userId);
    const readinessScore = computeReadinessScore(scores);
    const recommendations = getRecommendations(scores);

    res.status(200).json({
      success: true,
      data: { scores, readinessScore, recommendations },
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const [resumeHistory, interviewHistory, gdHistory] = await Promise.all([
      getResumeScoreHistory(userId),
      getInterviewHistory(userId),
      getGdHistory(userId),
    ]);

    res.status(200).json({
      success: true,
      data: { resumeHistory, interviewHistory, gdHistory },
    });
  } catch (error) {
    next(error);
  }
};

export const getSkillRadar = async (req, res, next) => {
  try {
    const radarData = await getSkillRadarData(req.user._id);
    res.status(200).json({ success: true, data: radarData });
  } catch (error) {
    next(error);
  }
};

export const getWeeklyChart = async (req, res, next) => {
  try {
    const weeklyData = await getWeeklyProgress(req.user._id);
    res.status(200).json({ success: true, data: weeklyData });
  } catch (error) {
    next(error);
  }
};

export const getTimeline = async (req, res, next) => {
  try {
    const timeline = await getActivityTimeline(req.user._id);
    res.status(200).json({ success: true, data: timeline });
  } catch (error) {
    next(error);
  }
};

export const getFeedback = async (req, res, next) => {
  try {
    const feedback = await getRecentFeedback(req.user._id);
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    next(error);
  }
};
