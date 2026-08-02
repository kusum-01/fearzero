import { useEffect, useState } from 'react';
import api from '../api/axios';
import DashboardLayout from '../components/layout/DashboardLayout';
import ScoreRing from '../components/analysis/ScoreRing';
import FeedbackList from '../components/analysis/FeedbackList';
import Loader from '../components/ui/Loader';
import ErrorMessage from '../components/ui/ErrorMessage';

const ResumeAnalysis = () => {
  const [status, setStatus] = useState('loading'); // loading | error | ready
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState(null);

  const fetchLatest = async () => {
    setStatus('loading');
    try {
      const { data } = await api.get('/analysis/latest');
      setAnalysis(data.data);
      setStatus('ready');
    } catch (err) {
      setStatus('error');
    }
  };

  useEffect(() => {
    fetchLatest();
  }, []);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalyzeError(null);
    try {
      const { data } = await api.post('/analysis/analyze');
      setAnalysis(data.data);
    } catch (err) {
      setAnalyzeError(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <Loader label="Loading analysis..." />
      </DashboardLayout>
    );
  }

  if (status === 'error') {
    return (
      <DashboardLayout>
        <ErrorMessage message="Couldn't load analysis data." onRetry={fetchLatest} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <section className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Resume Analysis</h1>
          <p className="text-sm text-gray-500 mt-1">
            AI-powered feedback based on your uploaded resume.
          </p>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {analyzing ? 'Analyzing...' : analysis ? 'Re-analyze Resume' : 'Analyze Resume'}
        </button>
      </section>

      {analyzeError && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
          {analyzeError}
        </div>
      )}

      {analyzing && (
        <div className="mb-6">
          <Loader label="Analyzing your resume — this can take a few seconds..." />
        </div>
      )}

      {!analysis && !analyzing && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center">
          <p className="text-gray-500">
            No analysis yet. Upload a resume, then click "Analyze Resume" to get started.
          </p>
        </div>
      )}

      {analysis && !analyzing && (
        <>
          <section className="grid grid-cols-2 gap-4 mb-6">
            <ScoreRing label="Overall Resume Score" score={analysis.overallScore} />
            <ScoreRing label="ATS Compatibility" score={analysis.atsScore} />
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeedbackList title="Strengths" items={analysis.strengths} icon="✅" />
            <FeedbackList title="Weaknesses" items={analysis.weaknesses} icon="⚠️" />
            <FeedbackList title="Missing Skills" items={analysis.missingSkills} icon="🧩" />
            <FeedbackList title="Suggested Improvements" items={analysis.suggestedImprovements} icon="💡" />
            <FeedbackList title="Grammar & Writing Feedback" items={analysis.grammarFeedback} icon="✍️" />
            <FeedbackList title="Recommended Technologies" items={analysis.recommendedTechnologies} icon="🛠️" />
            <FeedbackList title="Suggested Projects" items={analysis.suggestedProjects} icon="🚀" />
          </section>
        </>
      )}
    </DashboardLayout>
  );
};

export default ResumeAnalysis;
