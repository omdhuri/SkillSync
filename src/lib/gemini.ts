// ================================================
// SkillSync — Gemini AI Client
// All AI-powered features call through these helpers
// ================================================

import type { SkillGapResult } from './types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const MODEL = 'gemini-2.0-flash';

const isConfigured = !!API_KEY;

async function callGemini(prompt: string, systemInstruction?: string): Promise<string> {
    if (!isConfigured) {
        throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your environment.');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
                ...(systemInstruction && { systemInstruction: { parts: [{ text: systemInstruction }] } })
            }
        })
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function callGeminiJSON<T>(prompt: string, systemInstruction?: string): Promise<T> {
    const text = await callGemini(prompt, systemInstruction || 'Return valid JSON only.');
    return JSON.parse(text) as T;
}

export async function ask(prompt: string, systemInstruction?: string): Promise<string> {
    return callGemini(prompt, systemInstruction);
}

export async function askJSON<T>(prompt: string, systemInstruction?: string): Promise<T> {
    return callGeminiJSON<T>(prompt, systemInstruction);
}

// ================================================
// Feature-Specific Functions
// ================================================

export async function analyzeSkillGap(
    userSkills: string[],
    targetRole: string,
    industry?: string
): Promise<SkillGapResult> {
    return askJSON<SkillGapResult>(
        `You are a career counselor and technical recruiter. Analyze the skill gap for this candidate.

Candidate's current skills: ${userSkills.join(', ')}
Target role: ${targetRole}
${industry ? `Industry: ${industry}` : ''}

Compare their skills against what's typically required for the target role.

Return a JSON object with:
- "targetRole": the target role name
- "matchPercentage": number 0-100 showing overall match
- "matchedSkills": array of objects with {"name": string, "category": string, "importance": "High"|"Medium"|"Low"} for skills the candidate HAS
- "missingSkills": array of objects with {"name": string, "category": string, "importance": "High"|"Medium"|"Low"} for skills the candidate is MISSING

Include 5-10 relevant skills in total. Be realistic about importance levels.`
    );
}
