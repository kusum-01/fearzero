import { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import GdChatBubble from '../components/gd/GdChatBubble';
import GdTypingIndicator from '../components/gd/GdTypingIndicator';
import DiscussionTimer from '../components/gd/DiscussionTimer';
import GdSummarySection from '../components/gd/GdSummarySection';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import api from '../api/axios';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const GroupDiscussion = () => {
  const [stage, setStage] = useState('setup');
  const [difficulty, setDifficulty] = useState('Medium');
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [starting, setStarting] = useState(false);
  const [gd, setGd] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [gd?.messages?.length, sending]);

  const fetchTopics = async (level) => {
    setLoadingTopics(true);
    setError(null);
    setSelectedTopic('');
    try {
      const { data } = await api.get(`/gd/topics?difficulty=${level}`);
      setTopics(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load topics.');
    } finally {
      setLoadingTopics(false);
    }
  };

  useEffect(() => {
    fetchTopics(difficulty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDifficultyChange = (level) => {
    setDifficulty(level);
    fetchTopics(level);
  };

  const handleStart = async () => {
    if (!selectedTopic) return;
    setStarting(true);
    setError(null);
    try {
      const { data } = await api.post('/gd/start', { topic: selectedTopic, difficulty });
      setGd(data.data);
      setStage('chatting');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start discussion.');
    } finally {
      setStarting(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || sending) return;
    const message = inputValue.trim();
    setInputValue('');
    setSending(true);

    setGd((prev) => ({
      ...prev,
      messages: [...prev.messages, { speaker: 'user', speakerName: 'You', content: message }],
    }));

    try {
      const { data } = await api.post(`/gd/${gd._id}/message`, { message });
      setGd(data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send message.');
    } finally {
      setSending(false);
    }
  };

  const handleEnd = async () => {
    setStage('ending');
    setError(null);
    try {
      const { data } = await api.post(`/gd/${gd._id}/end`);
      setGd(data.data);
      setStage('summary');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not end discussion.');
      setStage('chatting');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetAll = () => {
    setGd(null);
    setSelectedTopic('');
    setStage('setup');
    fetchTopics(difficulty);
  };

  if (stage === 'setup') {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto">
          <h1 className="text-2xl font-semibold text-[#111827] mb-1">Group Discussion Simulator</h1>
          <p className="text-sm text-[#6B7280] mb-6">
            Practice with 3 AI participants and a moderator on a realistic GD topic.
          </p>

          {error && <Alert variant="error">{error}</Alert>}

          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
            <p className="text-sm font-medium text-[#111827] mb-2.5">Difficulty</p>
            <div className="flex gap-2 mb-6">
              {DIFFICULTIES.map((level) => (
                <button
                  key={level}
                  onClick={() => handleDifficultyChange(level)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors duration-150
                  ${difficulty === level ? 'bg-[#EC4899] text-white border-[#EC4899]' : 'border-[#E5E7EB] text-[#6B7280] hover:bg-[#FAFAFA]'}`}
                >
                  {level}
                </button>
              ))}
            </div>

            <p className="text-sm font-medium text-[#111827] mb-2.5">Choose a topic</p>
            {loadingTopics ? (
              <Loader label="Generating topics..." />
            ) : (
              <div className="space-y-2 mb-6">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm border transition-all duration-150
                    ${selectedTopic === topic ? 'border-[#EC4899] bg-[#FFF7FA] text-[#111827]' : 'border-[#E5E7EB] text-[#6B7280] hover:bg-[#FAFAFA]'}`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            )}

            <Button
              variant="primary"
              onClick={handleStart}
              disabled={!selectedTopic || starting}
              className="w-full"
            >
              {starting ? 'Starting...' : 'Start GD'}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (stage === 'ending') {
    return (
      <DashboardLayout>
        <Loader label="Generating your discussion feedback..." />
      </DashboardLayout>
    );
  }

  if (stage === 'summary') {
    return (
      <DashboardLayout>
        <section className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-[#111827]">GD Summary</h1>
            <p className="text-sm text-[#6B7280] mt-1">{gd.topic}</p>
          </div>
          <Button variant="primary" onClick={resetAll}>
            Start New GD
          </Button>
        </section>
        <GdSummarySection summary={gd.summary} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] bg-[#FAFAFA] rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-[#E5E7EB]">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-[#111827] truncate">{gd.topic}</h2>
            <p className="text-xs text-[#9CA3AF]">{gd.difficulty} • Moderator + 3 AI participants</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <DiscussionTimer durationSeconds={300} />
            <Button variant="destructive" onClick={handleEnd} className="!px-3 !py-1.5 text-xs">
              End Discussion
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {gd.messages.map((msg, idx) => (
            <GdChatBubble key={idx} speaker={msg.speaker} speakerName={msg.speakerName} content={msg.content} />
          ))}
          {sending && <GdTypingIndicator />}
          {error && <p className="text-xs text-[#EF4444] mt-2">{error}</p>}
          <div ref={bottomRef} />
        </div>

        <div className="p-3 bg-white border-t border-[#E5E7EB] flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
            placeholder="Share your point..."
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

export default GroupDiscussion;
