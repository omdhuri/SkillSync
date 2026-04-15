// ================================================
// SkillSync — Gemini AI Client
// All AI-powered features call through these helpers
// ================================================

import type {
    AptitudeQuestion,
    AtsReport,
    InterviewFeedback,
    Job,
    SkillGapResult,
} from './types';

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

async function ask(prompt: string, systemInstruction?: string): Promise<string> {
    return callGemini(prompt, systemInstruction);
}

async function askJSON<T>(prompt: string, systemInstruction?: string): Promise<T> {
    return callGeminiJSON<T>(prompt, systemInstruction);
}

// ================================================
// Feature-Specific Functions
// ================================================

export async function enhanceResumeBullets(bullets: string[]): Promise<string[]> {
    const result = await askJSON<{ bullets: string[] }>(
        `You are a professional resume writer. Enhance these resume bullet points to be more impactful.
Use strong action verbs (Spearheaded, Engineered, Optimized, Architected, etc.).
Add quantified metrics where possible (percentages, numbers, dollar amounts).
Keep each bullet concise (1-2 lines max).
Maintain the original meaning but make it more powerful.

Original bullets:
${bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}

Return a JSON object with a "bullets" array containing the enhanced versions in the same order.`
    );
    return result.bullets;
}

export async function generateAptitudeQuestions(
    category: string,
    difficulty: 'Easy' | 'Medium' | 'Hard',
    count: number = 5
): Promise<AptitudeQuestion[]> {
    const result = await askJSON<{ questions: AptitudeQuestion[] }>(
        `Generate ${count} multiple-choice aptitude test questions.

Category: ${category}
Difficulty: ${difficulty}

Each question must have:
- "id": sequential number starting from 1
- "category": "${category}"
- "difficulty": "${difficulty}"
- "text": the question text
- "options": array of 4 answer choices
- "correct": index (0-3) of the correct answer
- "explanation": brief explanation of the correct answer

Make questions challenging and diverse. Include real-world problem solving.
Return a JSON object with a "questions" array.`
    );
    return result.questions;
}

export async function chatWithInterviewer(
    history: { role: string; content: string }[],
    userMessage: string,
    topic: string,
    targetRole: string
): Promise<string> {
    const formattedHistory = history
        .map((msg) => `${msg.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${msg.content}`)
        .join('\n\n');

    return ask(
        `${formattedHistory ? `Previous conversation:\n${formattedHistory}\n\n` : ''}Candidate: ${userMessage}

Based on the conversation above, respond as the interviewer. Ask a natural follow-up question, provide brief feedback on their answer if applicable, or move to the next topic.`,
        `You are Sarah, an experienced technical interviewer at a top tech company. You are conducting a ${topic} interview for a ${targetRole} position.

Your interview style:
- Be professional, encouraging, but thorough
- Ask one question at a time
- After the candidate answers, give brief feedback (1 sentence) then ask the next question
- Cover both conceptual understanding and practical experience
- If this is the start of the interview, introduce yourself briefly and ask the first question
- Keep responses concise (2-4 sentences max)`
    );
}

export async function generateInterviewFeedback(
    messages: { role: string; content: string }[],
    topic: string
): Promise<InterviewFeedback> {
    const transcript = messages
        .map((msg) => `${msg.role === 'interviewer' ? 'Interviewer' : 'Candidate'}: ${msg.content}`)
        .join('\n\n');

    return askJSON<InterviewFeedback>(
        `Analyze this ${topic} technical interview transcript and provide feedback.

Transcript:
${transcript}

Return a JSON object with:
- "overallScore": number from 0-100
- "strengths": array of 2-3 strength strings
- "improvements": array of 2-3 improvement area strings
- "summary": 2-3 sentence overall performance summary`
    );
}

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

export async function lintResumeForATS(resumeText: string): Promise<AtsReport> {
    return askJSON<AtsReport>(
        `You are an Applicant Tracking System (ATS) expert. Analyze this resume for ATS compatibility.

Resume:
${resumeText}

Check for:
1. Formatting issues (tables, columns, images, headers/footers)
2. Contact information parsability
3. Standard section headings (Experience, Education, Skills)
4. Action verb usage in bullet points
5. Keyword optimization
6. File format considerations
7. Date format consistency
8. Quantified achievements

Return a JSON object with:
- "score": number 0-100 (ATS compatibility score)
- "issues": array of objects, each with:
  - "type": "error" | "warning" | "pass"
  - "title": short issue title
  - "description": detailed explanation and fix suggestion

Include at least 2 passes, 1-3 warnings, and 0-2 errors. Be realistic.`
    );
}

export async function generateJobSuggestions(
    skills: string[],
    targetRole?: string,
    location?: string
): Promise<Job[]> {
    const result = await askJSON<{ jobs: Job[] }>(
        `You are a job matching AI. Generate 6 realistic job listings that match this candidate's profile.

Candidate skills: ${skills.join(', ')}
${targetRole ? `Preferred role: ${targetRole}` : ''}
${location ? `Preferred location: ${location}` : ''}

For each job, return:
- "id": sequential number starting from 1
- "title": job title
- "company": a real well-known tech company name
- "location": city or "Remote"
- "salary": salary range as string (e.g., "$120k - $150k")
- "matchScore": 60-99 match percentage based on skills overlap
- "type": "Full-time" | "Part-time" | "Internship" | "Contract"
- "posted": realistic time ago string (e.g., "2 days ago")
- "skills": array of 3-5 required skills
- "description": 1-2 sentence job description

Return a JSON object with a "jobs" array. Sort by matchScore descending.`
    );
    return result.jobs;
}

export async function generateProfessionalSummary(
    targetRole: string,
    skills: string[],
    yearsOfExperience: string
): Promise<string> {
    return ask(
        `Write a concise, powerful 2-3 sentence professional summary for a resume.
Target Role: ${targetRole}
Years of Experience: ${yearsOfExperience}
Top Skills: ${skills.slice(0, 8).join(', ')}

Requirements:
- Start with a strong opening (e.g. "Results-driven", "Passionate", "Innovative")
- Mention the target role and years of experience
- Highlight 2-3 key skills or achievements
- End with a value proposition (what they bring to the employer)
- Keep it under 60 words, no clichés, ATS-friendly
- Return ONLY the summary text, no quotes or labels`
    );
}

export async function rewriteSingleBullet(bullet: string): Promise<string> {
    return ask(
        `Rewrite this resume bullet point to be more impactful and ATS-optimized.

Original: "${bullet}"

Rules:
- Start with a strong action verb (Engineered, Spearheaded, Architected, Optimized, etc.)
- Add quantified metrics if not present (estimate reasonable numbers)
- Keep it to 1 line max
- Do NOT add quotes or explanations
- Return ONLY the rewritten bullet`
    );
}
