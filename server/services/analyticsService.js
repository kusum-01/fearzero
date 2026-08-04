import mongoose from 'mongoose';
import Analysis from '../models/Analysis.js';
import Interview from '../models/Interview.js';
import GroupDiscussion from '../models/GroupDiscussion.js';

export const getLatestScores = async (userId) => {
  const [latestAnalysis, latestInterview, latestGd] = await Promise.all([
    Analysis.findOne({ user: userId }).sort({ createdAt: -1 }),
    Interview.findOne({ user: userId, status: 'completed' }).sort({ createdAt: -1 }),
    GroupDiscussion.findOne({ user: userId, status: 'completed' }).sort({ createdAt: -1 }),
  ]);

  return {
    resumeScore: latestAnalysis?.overallScore ?? null,
    interviewScore: latestInterview?.summary?.overallScore ?? null,
    gdScore: latestGd?.summary?.overallScore ?? null,
  };
};

export const computeReadinessScore = (scores) => {
  const available = Object.values(scores).filter((s) => s !== null);
  if (available.length === 0) return 0;
  const sum = available.reduce((acc, s) => acc + s, 0);
  return Math.round(sum / available.length);
};

export const getResumeScoreHistory = async (userId) => {
  return Analysis.find({ user: userId })
    .sort({ createdAt: 1 })
    .select('overallScore atsScore createdAt')
    .lean();
};

export const getInterviewHistory = async (userId) => {
  return Interview.find({ user: userId, status: 'completed' })
    .sort({ createdAt: 1 })
    .select('summary.overallScore summary.communicationScore createdAt')
    .lean();
};

export const getGdHistory = async (userId) => {
  return GroupDiscussion.find({ user: userId, status: 'completed' })
    .sort({ createdAt: 1 })
    .select('topic difficulty summary.overallScore createdAt')
    .lean();
};

export const getSkillRadarData = async (userId) => {
  const [latestInterview, latestGd] = await Promise.all([
    Interview.findOne({ user: userId, status: 'completed' }).sort({ createdAt: -1 }),
    GroupDiscussion.findOne({ user: userId, status: 'completed' }).sort({ createdAt: -1 }),
  ]);

  return {
    communication: avgOf(latestInterview?.summary?.communicationScore, latestGd?.summary?.communication),
    confidence: avgOf(latestInterview?.summary?.confidenceScore, latestGd?.summary?.confidence),
    clarity: latestInterview?.summary?.clarityScore ?? 0,
    criticalThinking: latestGd?.summary?.criticalThinking ?? 0,
    leadership: latestGd?.summary?.leadership ?? 0,
    professionalism: latestInterview?.summary?.professionalismScore ?? 0,
  };
};

const avgOf = (a, b) => {
  const vals = [a, b].filter((v) => typeof v === 'number');
  if (vals.length === 0) return 0;
  return Math.round(vals.reduce((s, v) => s + v, 0) / vals.length);
};

export const getWeeklyProgress = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const eightWeeksAgo = new Date();
  eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

  const pipeline = (Model, scoreField) => [
    { $match: { user: userObjectId, createdAt: { $gte: eightWeeksAgo } } },
    {
      $group: {
        _id: { $isoWeek: '$createdAt' },
        avgScore: { $avg: scoreField },
        count: { $sum: 1 },
        weekStart: { $min: '$createdAt' },
      },
    },
    { $sort: { weekStart: 1 } },
  ];

  const [resumeWeekly, interviewWeekly, gdWeekly] = await Promise.all([
    Analysis.aggregate(pipeline(Analysis, '$overallScore')),
    Interview.aggregate([
      { $match: { user: userObjectId, status: 'completed', createdAt: { $gte: eightWeeksAgo } } },
      {
        $group: {
          _id: { $isoWeek: '$createdAt' },
          avgScore: { $avg: '$summary.overallScore' },
          count: { $sum: 1 },
          weekStart: { $min: '$createdAt' },
        },
      },
      { $sort: { weekStart: 1 } },
    ]),
    GroupDiscussion.aggregate([
      { $match: { user: userObjectId, status: 'completed', createdAt: { $gte: eightWeeksAgo } } },
      {
        $group: {
          _id: { $isoWeek: '$createdAt' },
          avgScore: { $avg: '$summary.overallScore' },
          count: { $sum: 1 },
          weekStart: { $min: '$createdAt' },
        },
      },
      { $sort: { weekStart: 1 } },
    ]),
  ]);

  return { resumeWeekly, interviewWeekly, gdWeekly };
};

export const getActivityTimeline = async (userId, limit = 15) => {
  const [analyses, interviews, gds] = await Promise.all([
    Analysis.find({ user: userId }).sort({ createdAt: -1 }).limit(limit).lean(),
    Interview.find({ user: userId, status: 'completed' }).sort({ createdAt: -1 }).limit(limit).lean(),
    GroupDiscussion.find({ user: userId, status: 'completed' }).sort({ createdAt: -1 }).limit(limit).lean(),
  ]);

  const events = [
    ...analyses.map((a) => ({
      type: 'resume_analysis',
      label: 'Resume Analyzed',
      score: a.overallScore,
      date: a.createdAt,
    })),
    ...interviews.map((i) => ({
      type: 'hr_interview',
      label: 'HR Interview Completed',
      score: i.summary?.overallScore,
      date: i.createdAt,
    })),
    ...gds.map((g) => ({
      type: 'group_discussion',
      label: `GD Completed: ${g.topic}`,
      score: g.summary?.overallScore,
      date: g.createdAt,
    })),
  ];

  return events.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, limit);
};

export const getRecentFeedback = async (userId) => {
  const [latestAnalysis, latestInterview, latestGd] = await Promise.all([
    Analysis.findOne({ user: userId }).sort({ createdAt: -1 }),
    Interview.findOne({ user: userId, status: 'completed' }).sort({ createdAt: -1 }),
    GroupDiscussion.findOne({ user: userId, status: 'completed' }).sort({ createdAt: -1 }),
  ]);

  const feedback = [];

  if (latestAnalysis) {
    feedback.push({
      source: 'Resume Analysis',
      feedback: latestAnalysis.suggestedImprovements?.[0] || 'No specific feedback available.',
      date: latestAnalysis.createdAt,
    });
  }
  if (latestInterview) {
    feedback.push({
      source: 'HR Interview',
      feedback: latestInterview.summary?.finalFeedback || 'No specific feedback available.',
      date: latestInterview.createdAt,
    });
  }
  if (latestGd) {
    feedback.push({
      source: 'Group Discussion',
      feedback: latestGd.summary?.detailedFeedback || 'No specific feedback available.',
      date: latestGd.createdAt,
    });
  }

  return feedback.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getRecommendations = (scores) => {
  const recommendations = [];
  const { resumeScore, interviewScore, gdScore } = scores;

  if (resumeScore === null) {
    recommendations.push('Upload and analyze your resume to get personalized feedback.');
  } else if (resumeScore < 70) {
    recommendations.push('Your resume score is below 70 — revisit the Suggested Improvements from your last analysis.');
  }

  if (interviewScore === null) {
    recommendations.push('Try an HR Interview session to practice your communication and confidence.');
  } else if (interviewScore < 70) {
    recommendations.push('Your HR Interview scores could improve — focus on clarity and structured answers (STAR method).');
  }

  if (gdScore === null) {
    recommendations.push('Practice a Group Discussion to build critical thinking and participation skills.');
  } else if (gdScore < 70) {
    recommendations.push('Your GD performance suggests working on assertiveness and relevance to the topic.');
  }

  if (
    resumeScore !== null && interviewScore !== null && gdScore !== null &&
    resumeScore >= 70 && interviewScore >= 70 && gdScore >= 70
  ) {
    recommendations.push('Great progress across all areas! Keep practicing to maintain consistency.');
  }

  return recommendations;
};
