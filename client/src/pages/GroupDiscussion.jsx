import { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import GdChatBubble from '../components/gd/GdChatBubble';
import GdTypingIndicator from '../components/gd/GdTypingIndicator';
import DiscussionTimer from '../components/gd/DiscussionTimer';
import GdSummarySection from '../components/gd/GdSummarySection';
import Loader from '../components/ui/Loader';
import api from '../api/axios';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const GroupDiscussion = () => {
  const [stage, setStage] = useState('setup'); // setup | chatting | ending | summary
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
          <h1 className="text-xl font-semibold text-gray-800 mb-1">Group Discussion Simulator</h1>
          <p className="text-sm text-gray-500 mb-6">
            Practice with 3 AI participants and a moderator on a realistic GD topic.
          </p>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Difficulty</p>
            <div className="flex gap-2 mb-6">
              {DIFFICULTIES.map((level) => (
                <button
                  key={level}
                  onClick={() => handleDifficultyChange(level)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border
                  ${difficulty === level ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {level}
                </button>
              ))}
            </div>

            <p className="text-sm font-medium text-gray-700 mb-2">Choose a topic</p>
            {loadingTopics ? (
              <Loader label="Generating topics..." />
            ) : (
              <div className="space-y-2 mb-6">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-sm border transition-colors
                    ${selectedTopic === topic ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={!selectedTopic || starting}
              className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {starting ? 'Starting...' : 'Start GD'}
            </button>
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
            <h1 className="text-xl font-semibold text-gray-800">GD Summary</h1>
            <p className="text-sm text-gray-500 mt-1">{gd.topic}</p>
          </div>
          <button
            onClick={resetAll}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
            Start New GD
          </button>
        </section>
        <GdSummarySection summary={gd.summary} />
      </DashboardLayout>
    );
  }

  // stage === 'chatting'
  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)] bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-gray-700 truncate">{gd.topic}</h2>
            <p className="text-xs text-gray-400">{gd.difficulty} • Moderator + 3 AI participants</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <DiscussionTimer durationSeconds={300} />
            <button
              onClick={handleEnd}
              className="px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-md hover:bg-red-50"
            >
              End Discussion
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {gd.messages.map((msg, idx) => (
            <GdChatBubble key={idx} speaker={msg.speaker} speakerName={msg.speakerName} content={msg.content} />
          ))}
          {sending && <GdTypingIndicator />}
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
          <div ref={bottomRef} />
        </div>

        <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
            placeholder="Share your point..."
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

export default GroupDiscussion;
