import Groq from 'groq-sdk';

let client;
const getClient = () => {
  if (!client) {
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return client;
};

export const PARTICIPANTS = {
  moderator: { name: 'Moderator', role: 'moderator' },
  participant1: { name: 'Aditi', role: 'analytical, data-driven, asks clarifying questions' },
  participant2: { name: 'Rohan', role: 'assertive, opinionated, likes to challenge points' },
  participant3: { name: 'Meera', role: 'diplomatic, brings balanced perspectives, builds on others\' points' },
};

const buildPersonaBlock = () => `
Participants in this Group Discussion:
- Moderator: introduces the topic, invites participants, keeps discussion on track, ends it when appropriate.
- Aditi: analytical and data-driven; asks clarifying questions; measured tone.
- Rohan: assertive and opinionated; likes to challenge points and push back respectfully.
- Meera: diplomatic; builds on others' points, brings balanced perspectives, occasionally asks the user follow-up questions.
`;

export const generateTopics = async (difficulty) => {
  try {
    const response = await getClient().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Generate 5 realistic Group Discussion topics suitable for a ${difficulty} difficulty level (placement/campus interview context). Return ONLY a valid JSON object: {"topics": ["...", "...", "...", "...", "..."]}. No markdown, no commentary.`,
        },
        { role: 'user', content: 'Generate the topics now.' },
      ],
      response_format: { type: 'json_object' },
    });

    const parsed = JSON.parse(response.choices[0].message.content.trim());
    return parsed.topics;
  } catch (error) {
    console.error('RAW AI ERROR (topics):', error);
    throw buildFriendlyError(error);
  }
};

export const generateModeratorOpening = async (topic) => {
  try {
    const response = await getClient().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are the Moderator of a Group Discussion. ${buildPersonaBlock()}\nIntroduce the topic "${topic}" to the group in 2-3 sentences, and invite the user (a candidate practicing for placements) to share their opening thoughts. Respond with ONLY the moderator's spoken line, no labels or preamble.`,
        },
        { role: 'user', content: 'Begin the discussion.' },
      ],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('RAW AI ERROR (opening):', error);
    throw buildFriendlyError(error);
  }
};

export const generateNextTurn = async ({ topic, messages }) => {
  try {
    const transcript = messages
      .map((m) => `${m.speakerName}: ${m.content}`)
      .join('\n');

    const response = await getClient().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are simulating a live Group Discussion on the topic: "${topic}".
${buildPersonaBlock()}

Given the transcript so far, decide who should speak next among: Moderator, Aditi, Rohan, or Meera
(never pick the user — they speak on their own). Pick whichever speaker makes the most natural next
contribution — agreeing, disagreeing, asking a follow-up, or the moderator redirecting if needed.
Avoid repetitive phrasing or having the same speaker go twice in a row unless truly natural.

Return ONLY a valid JSON object: {"speaker": "moderator" | "participant1" | "participant2" | "participant3", "content": "<their spoken line, 2-4 sentences>"}
No markdown, no commentary. speaker key must map to: moderator=Moderator, participant1=Aditi, participant2=Rohan, participant3=Meera.`,
        },
        { role: 'user', content: `Transcript so far:\n${transcript}\n\nGenerate the next turn.` },
      ],
      response_format: { type: 'json_object' },
    });

    return JSON.parse(response.choices[0].message.content.trim());
  } catch (error) {
    console.error('RAW AI ERROR (next turn):', error);
    throw buildFriendlyError(error);
  }
};

export const generateGdSummary = async ({ topic, messages }) => {
  try {
    const transcript = messages
      .map((m) => `${m.speakerName}: ${m.content}`)
      .join('\n');

    const response = await getClient().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert Group Discussion evaluator assessing ONLY the "user" participant's
contributions in the transcript below (topic: "${topic}"). Return ONLY a valid JSON object with this
exact structure, no markdown, no commentary:

{
  "overallScore": <0-100>,
  "communication": <0-100>,
  "confidence": <0-100>,
  "criticalThinking": <0-100>,
  "leadership": <0-100>,
  "relevance": <0-100>,
  "vocabulary": <0-100>,
  "fluency": <0-100>,
  "participation": <0-100>,
  "strengths": [<string>, ...],
  "weaknesses": [<string>, ...],
  "detailedFeedback": "<string, 3-5 sentences>",
  "improvementSuggestions": [<string>, ...]
}

Base every field strictly on the user's actual contributions. 3-6 items per array field.`,
        },
        { role: 'user', content: `Transcript:\n${transcript}` },
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
