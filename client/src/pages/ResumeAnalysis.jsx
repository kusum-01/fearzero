import { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, PuzzleIcon, Lightbulb, PenLine, Wrench, Rocket } from 'lucide-react';
import api from '../api/axios';
import DashboardLayout from '../components/layout/DashboardLayout';
import ScoreRing from '../components/analysis/ScoreRing';
import FeedbackList from '../components/analysis/FeedbackList';
import Loader from '../components/ui/Loader';
import ErrorMessage from '../components/ui/ErrorMessage';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';

const ResumeAnalysis = () => {
  const [status, setStatus] = useState('loading');
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
          <h1 className="text-2xl font-semibold text-[#111827]">Resume Analysis</h1>
          <p className="text-sm text-[#6B7280] mt-1">AI-powered feedback based on your uploaded resume.</p>
        </div>

        <Button variant="primary" onClick={handleAnalyze} disabled={analyzing}>
          {analyzing ? 'Analyzing...' : analysis ? 'Re-analyze Resume' : 'Analyze Resume'}
        </Button>
      </section>

      {analyzeError && <Alert variant="error">{analyzeError}</Alert>}

      {analyzing && (
        <div className="mb-6">
          <Loader label="Analyzing your resume — this can take a few seconds..." />
        </div>
      )}

      {!analysis && !analyzing && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm p-12 text-center">
          <p className="text-sm text-[#6B7280]">
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
            <FeedbackList title="Strengths" items={analysis.strengths} icon={CheckCircle2} tone="#22C55E" />
            <FeedbackList title="Weaknesses" items={analysis.weaknesses} icon={AlertTriangle} tone="#F59E0B" />
            <FeedbackList title="Missing Skills" items={analysis.missingSkills} icon={PuzzleIcon} tone="#3B82F6" />
            <FeedbackList title="Suggested Improvements" items={analysis.suggestedImprovements} icon={Lightbulb} tone="#EC4899" />
            <FeedbackList title="Grammar & Writing Feedback" items={analysis.grammarFeedback} icon={PenLine} tone="#6B7280" />
            <FeedbackList title="Recommended Technologies" items={analysis.recommendedTechnologies} icon={Wrench} tone="#3B82F6" />
            <FeedbackList title="Suggested Projects" items={analysis.suggestedProjects} icon={Rocket} tone="#EC4899" />
          </section>
        </>
      )}
    </DashboardLayout>
  );
};

export default ResumeAnalysis;
