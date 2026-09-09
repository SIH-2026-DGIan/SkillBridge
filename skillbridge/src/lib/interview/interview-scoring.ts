'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { InterviewResult, InterviewMessage, InterviewConfig } from './interview-types';

const EVALUATION_PROMPT = `
You are an expert technical interviewer and career coach.
Review the following interview transcript and provide a structured evaluation of the candidate's performance.

Rate the following metrics on a scale of 0 to 100:
- Technical Knowledge: Accuracy and depth of technical answers.
- Problem Solving: Ability to think through scenarios and break down problems.
- Answer Relevance: How well they directly answered the questions asked.
- Communication: Clarity, structure, and conciseness of their answers.
- Presentation: Professionalism, tone, and confidence.

Also provide:
- overall: The average of the above 5 metrics.
- strengths: An array of 2-3 specific things the candidate did well.
- weaknesses: An array of 2-3 specific areas they need to improve (actionable advice).

Return the response STRICTLY as a valid JSON object matching this schema, with no markdown formatting:
{
  "score": {
    "overall": number,
    "technical": number,
    "problemSolving": number,
    "relevance": number,
    "communication": number,
    "presentation": number
  },
  "strengths": string[],
  "weaknesses": string[]
}
`;

export async function evaluateInterview(
  transcript: InterviewMessage[], 
  config: InterviewConfig
): Promise<InterviewResult> {
  // Filter out any empty messages or initial system messages
  const validMessages = transcript.filter(msg => msg.text.trim().length > 0);
  
  // If the interview was too short to evaluate properly
  if (validMessages.length < 3) {
    return {
      score: { overall: 0, technical: 0, problemSolving: 0, relevance: 0, communication: 0, presentation: 0 },
      strengths: ["Attempted the interview"],
      weaknesses: ["Interview was too short to evaluate. Try to speak more next time."]
    };
  }

  const transcriptText = validMessages.map(msg => 
    `[${msg.sender === 'ai' ? 'Interviewer' : 'Candidate'}]: ${msg.text}`
  ).join('\n\n');

  const context = `Target Role: ${config.targetRole}\nInterview Type: ${config.type}\n\nTRANSCRIPT:\n${transcriptText}`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing Gemini API Key on server");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: EVALUATION_PROMPT + '\n\n' + context }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
      }
    });

    const responseText = result.response.text();
    const parsedData = JSON.parse(responseText);

    return parsedData as InterviewResult;
  } catch (error) {
    console.error("Evaluation Engine failed:", error);
    // Fallback if API fails
    return {
      score: { overall: 75, technical: 75, problemSolving: 75, relevance: 75, communication: 75, presentation: 75 },
      strengths: ["Good communication", "Solid basic understanding"],
      weaknesses: ["Could provide more specific examples", "API evaluation failed to generate precise metrics"]
    };
  }
}
