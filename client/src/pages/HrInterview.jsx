import { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import ChatBubble from '../components/interview/ChatBubble';
import TypingIndicator from '../components/interview/TypingIndicator';
import SummarySection from '../components/interview/SummarySection';
import Loader from '../components/ui/Loader';
import ErrorMessage from '../components/ui/ErrorMessage';
import api from '../api/axios';

const HrInterview = () => {
  const [stage, setStage] = useState('landing'); // landing | chatting | ending | summary | error
  const [interview, setInterview] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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

    // Optimistically show the user's message immediately
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
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 text-center max-w-lg mx-auto">
          <h1 className="text-xl font-semibold text-gray-800 mb-2">AI HR Interview</h1>
          <p className="text-sm text-gray-500 mb-6">
            Practice a realistic HR interview with an AI interviewer. Answer honestly —
            you'll get detailed feedback at the end.
          </p>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <button
            onClick={handleStart}
            disabled={starting}
            className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {starting ? 'Starting...' : 'Start Interview'}
          </button>
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
          <h1 className="text-xl font-semibold text-gray-800">Interview Summary</h1>
          <button
            onClick={() => {
              setInterview(null);
              setStage('landing');
            }}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            Start New Interview
          </button>
        </section>
        <SummarySection summary={interview.summary} />
      </DashboardLayout>
    );
  }

  // stage === 'chatting'
  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">HR Interview in progress</h2>
          <button
            onClick={handleEnd}
            className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-md hover:bg-red-50"
          >
            End Interview
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {interview.messages.map((msg, idx) => (
            <ChatBubble key={idx} role={msg.role} content={msg.content} />
          ))}
          {sending && <TypingIndicator />}
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          <div ref={bottomRef} />
        </div>

        <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
            placeholder="Type your answer..."
            rows={1}
            className="flex-1 resize-none px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={sending || !inputValue.trim()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HrInterview;
