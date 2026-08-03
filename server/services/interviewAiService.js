import Groq from 'groq-sdk';

let client;
const getClient = () => {
  if (!client) {
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return client;
};

const QUESTION_SYSTEM_PROMPT = `
You are an experienced HR interviewer conducting a realistic behavioral/HR interview.
Ask one thoughtful HR question at a time, adapting each new question based on the
candidate's previous answers. Cover common HR areas: background, motivation, strengths/weaknesses,
teamwork, conflict handling, career goals. Keep questions natural and conversational,
not robotic. Ask only ONE question per turn. Do not include any preamble, labels, or
commentary — respond with ONLY the question text itself.
`;

const SUMMARY_SYSTEM_PROMPT = `
You are an expert HR interview evaluator. Based on the full interview transcript provided,
return ONLY a valid JSON object with this exact structure, no markdown, no code fences,
no extra commentary:

{
  "overallScore": <number 0-100>,
  "communicationScore": <number 0-100>,
  "confidenceScore": <number 0-100>,
  "clarityScore": <number 0-100>,
  "professionalismScore": <number 0-100>,
  "strengths": [<string>, ...],
  "areasForImprovement": [<string>, ...],
  "suggestedBetterAnswers": [<string>, ...],
  "finalFeedback": "<string, 2-4 sentences>"
}

Base scores and feedback strictly on the candidate's actual answers in the transcript.
Provide 3-6 items per array field.
`;

export const generateNextQuestion = async (messages) => {
  try {
    const chatMessages = [
      { role: 'system', content: QUESTION_SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content,
      })),
    ];

    // Seed the very first question if history is empty
    if (messages.length === 0) {
      chatMessages.push({
        role: 'user',
        content: 'Begin the interview with your first question.',
      });
    }

    const response = await getClient().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: chatMessages,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('RAW AI ERROR (question):', error);
    throw buildFriendlyError(error);
  }
};

export const generateInterviewSummary = async (messages) => {
  try {
    const transcript = messages
      .map((m) => `${m.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.content}`)
      .join('\n');

    const response = await getClient().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SUMMARY_SYSTEM_PROMPT },
        { role: 'user', content: transcript },
      ],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content.trim());
  } catch (error) {
    console.error('RAW AI ERROR (summary):', error);
    throw buildFriendlyError(error);
  }
};

const buildFriendlyError = (error) => {
  if (error.status === 429) {
    const e = new Error('AI rate limit reached. Please try again in a moment.');
    e.statusCode = 429;
    return e;
  }
  if (error.status === 401 || error.status === 403) {
    const e = new Error('AI service authentication failed.');
    e.statusCode = 500;
    return e;
  }
  const e = new Error('AI request failed. Please try again.');
  e.statusCode = 502;
  return e;
};
