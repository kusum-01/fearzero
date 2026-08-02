import Groq from 'groq-sdk';

let client;
const getClient = () => {
  if (!client) {
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return client;
};

const ANALYSIS_SCHEMA_PROMPT = `
You are an expert resume reviewer and ATS (Applicant Tracking System) specialist.
Analyze the resume text provided and return ONLY a valid JSON object with this exact structure,
no markdown, no code fences, no extra commentary, no text before or after the JSON:

{
  "overallScore": <number 0-100>,
  "atsScore": <number 0-100>,
  "strengths": [<string>, ...],
  "weaknesses": [<string>, ...],
  "missingSkills": [<string>, ...],
  "suggestedImprovements": [<string>, ...],
  "grammarFeedback": [<string>, ...],
  "recommendedTechnologies": [<string>, ...],
  "suggestedProjects": [<string>, ...]
}

Base every field strictly on the resume content given. Be specific and actionable, not generic.
Provide 3-6 items per array field.
`;

export const analyzeResumeText = async (resumeText) => {
  const prompt = `${ANALYSIS_SCHEMA_PROMPT}\n\nRESUME TEXT:\n"""${resumeText}"""`;

  try {
    const response = await getClient().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const rawText = response.choices[0].message.content.trim();
    return JSON.parse(rawText);
  } catch (error) {
    console.error('RAW AI ERROR:', error);
    if (error.status === 429) {
      const rateLimitError = new Error('AI analysis rate limit reached. Please try again in a moment.');
      rateLimitError.statusCode = 429;
      throw rateLimitError;
    }
    if (error.status === 401 || error.status === 403) {
      const authError = new Error('AI service authentication failed.');
      authError.statusCode = 500;
      throw authError;
    }
    const genericError = new Error('AI analysis failed. Please try again.');
    genericError.statusCode = 502;
    throw genericError;
  }
};
