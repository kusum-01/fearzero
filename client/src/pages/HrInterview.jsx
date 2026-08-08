import { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import ChatBubble from '../components/interview/ChatBubble';
import TypingIndicator from '../components/interview/TypingIndicator';
import SummarySection from '../components/interview/SummarySection';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import api from '../api/axios';

const HrInterview = () => {
  const [stage, setStage] = useState('landing');
  const [interview, setInterview] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [interview?.messages?.length, sending]);

  const handleStart = async () => {
    setStarting(true);
    setError(null);
    try {
      const { data } = await api.post('/interview/start');
      setInterview(data.data);
      setStage('chatting');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start interview.');
    } finally {
      setStarting(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || sending) return;
    const answer = inputValue.trim();
    setInputValue('');
    setSending(true);

    setInterview((prev) => ({
      ...prev,
      messages: [...prev.messages, { role: 'user', content: answer }],
    }));

    try {
      const { data } = await api.post(`/interview/${interview._id}/answer`, { answer });
      setInterview(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send answer. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleEnd = async () => {
    setStage('ending');
    setError(null);
    try {
      const { data } = await api.post(`/interview/${interview._id}/end`);
      setInterview(data.data);
      setStage('summary');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not end interview.');
      setStage('chatting');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (stage === 'landing') {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-12 text-center max-w-lg mx-auto">
          <h1 className="text-2xl font-semibold text-[#111827] mb-2">AI HR Interview</h1>
          <p className="text-sm text-[#6B7280] mb-8">
            Practice a realistic HR interview with an AI interviewer. Answer honestly —
            you'll get detailed feedback at the end.
          </p>
          {error && <Alert variant="error">{error}</Alert>}
          <Button variant="primary" onClick={handleStart} disabled={starting}>
            {starting ? 'Starting...' : 'Start Interview'}
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  if (stage === 'ending') {
    return (
      <DashboardLayout>
        <Loader label="Generating your interview feedback..." />
      </DashboardLayout>
    );
  }

  if (stage === 'summary') {
    return (
      <DashboardLayout>
        <section className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-2xl font-semibold text-[#111827]">Interview Summary</h1>
          <Button
            variant="primary"
            onClick={() => {
              setInterview(null);
              setStage('landing');
            }}
          >
            Start New Interview
          </Button>
        </section>
        <SummarySection summary={interview.summary} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] bg-[#FAFAFA] rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#E5E7EB]">
          <h2 className="text-sm font-semibold text-[#111827]">HR Interview in progress</h2>
          <Button variant="destructive" onClick={handleEnd} className="!px-3 !py-1.5 text-xs">
            End Interview
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {interview.messages.map((msg, idx) => (
            <ChatBubble key={idx} role={msg.role} content={msg.content} />
          ))}
          {sending && <TypingIndicator />}
          {error && <p className="text-xs text-[#EF4444] mt-2">{error}</p>}
          <div ref={bottomRef} />
        </div>

        <div className="p-3 bg-white border-t border-[#E5E7EB] flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
            placeholder="Type your answer..."
            rows={1}
            className="flex-1 resize-none px-3.5 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EC4899]/20 focus:border-[#EC4899] disabled:opacity-50"
          />
          <Button variant="primary" onClick={handleSend} disabled={sending || !inputValue.trim()}>
            Send
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HrInterview;
