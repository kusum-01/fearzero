import { useEffect, useState, useCallback } from 'react';
import api from '../api/axios';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatCard from '../components/ui/StatCard';
import QuickActions from '../components/dashboard/QuickActions';
import RecentActivity from '../components/dashboard/RecentActivity';
import Loader from '../components/ui/Loader';
import ErrorMessage from '../components/ui/ErrorMessage';

const Dashboard = () => {
  const [status, setStatus] = useState('loading'); // loading | error | success
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setStatus('loading');
    try {
      const { data } = await api.get('/dashboard/stats');
      setDashboardData(data.data);
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <Loader label="Loading your dashboard..." />
      </DashboardLayout>
    );
  }

  if (status === 'error') {
    return (
      <DashboardLayout>
        <ErrorMessage message="Couldn't load dashboard data." onRetry={fetchDashboard} />
      </DashboardLayout>
    );
  }

  const { user, stats, recentActivity } = dashboardData;

  return (
    <DashboardLayout>
      <section className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Welcome back, {user.name} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Here's how your preparation is going.</p>
      </section>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Tests Completed" value={stats.testsCompleted} icon="✅" />
        <StatCard label="Accuracy" value={`${stats.accuracy}%`} icon="🎯" />
        <StatCard label="Study Streak" value={`${stats.studyStreak}d`} icon="🔥" />
        <StatCard label="Hours Practiced" value={stats.hoursPracticed} icon="⏱️" />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <QuickActions />
        <RecentActivity activity={recentActivity} />
      </section>
    </DashboardLayout>
  );
};

export default Dashboard;
