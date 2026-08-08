import { useEffect, useState } from 'react';
import api from '../api/axios';
import DashboardLayout from '../components/layout/DashboardLayout';
import Loader from '../components/ui/Loader';
import ErrorMessage from '../components/ui/ErrorMessage';
import ReadinessScoreCard from '../components/analytics/ReadinessScoreCard';
import ScoreHistoryChart from '../components/analytics/ScoreHistoryChart';
import SkillRadarChart from '../components/analytics/SkillRadarChart';
import WeeklyProgressChart from '../components/analytics/WeeklyProgressChart';
import ActivityTimeline from '../components/analytics/ActivityTimeline';
import RecentFeedback from '../components/analytics/RecentFeedback';
import Recommendations from '../components/analytics/Recommendations';

const ProgressAnalytics = () => {
  const [status, setStatus] = useState('loading');
  const [overview, setOverview] = useState(null);
  const [history, setHistory] = useState(null);
  const [radar, setRadar] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const fetchAll = async () => {
    setStatus('loading');
    try {
      const [overviewRes, historyRes, radarRes, weeklyRes, timelineRes, feedbackRes] = await Promise.all([
        api.get('/analytics/overview'),
        api.get('/analytics/history'),
        api.get('/analytics/skill-radar'),
        api.get('/analytics/weekly'),
        api.get('/analytics/timeline'),
        api.get('/analytics/feedback'),
      ]);

      setOverview(overviewRes.data.data);
      setHistory(historyRes.data.data);
      setRadar(radarRes.data.data);
      setWeekly(weeklyRes.data.data);
      setTimeline(timelineRes.data.data);
      setFeedback(feedbackRes.data.data);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <Loader label="Loading your progress..." />
      </DashboardLayout>
    );
  }

  if (status === 'error') {
    return (
      <DashboardLayout>
        <ErrorMessage message="Couldn't load analytics data." onRetry={fetchAll} />
      </DashboardLayout>
    );
  }

  const resumeChartData = history.resumeHistory.map((r, idx) => ({ label: `#${idx + 1}`, score: r.overallScore }));
  const interviewChartData = history.interviewHistory.map((i, idx) => ({ label: `#${idx + 1}`, score: i.summary?.overallScore }));
  const gdChartData = history.gdHistory.map((g, idx) => ({ label: `#${idx + 1}`, score: g.summary?.overallScore }));

  return (
    <DashboardLayout>
      <section className="mb-6">
        <h1 className="text-2xl font-semibold text-[#111827]">Progress & Analytics</h1>
        <p className="text-sm text-[#6B7280] mt-1">Track your placement preparation journey.</p>
      </section>

      <section className="mb-6">
        <ReadinessScoreCard score={overview.readinessScore} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <ScoreHistoryChart title="Resume Score History" data={resumeChartData} dataKey="score" color="#EC4899" />
        <ScoreHistoryChart title="HR Interview History" data={interviewChartData} dataKey="score" color="#3B82F6" />
        <ScoreHistoryChart title="GD Performance History" data={gdChartData} dataKey="score" color="#F59E0B" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <SkillRadarChart data={radar} />
        <WeeklyProgressChart weeklyData={weekly} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ActivityTimeline events={timeline} />
        <RecentFeedback feedback={feedback} />
        <Recommendations recommendations={overview.recommendations} />
      </section>
    </DashboardLayout>
  );
};

export default ProgressAnalytics;
