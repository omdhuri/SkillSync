# SkillSync

SkillSync is an AI-powered Career Management System built as a modern web application. It helps users manage their career progression by offering various tools and features ranging from resume building to skill gap analysis and mock interviews.

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in `.env` or `.env.local` to your Google Gemini API key. You can copy the example configuration:
   ```bash
   cp .env.example .env
   ```
3. Run the application:
   ```bash
   npm run dev
   ```

## Key Features
- **Dashboard:** Overview of career metrics, goals, and recent activities.
- **Roadmap:** Visual career path planning and milestone tracking.
- **Resume Builder:** Craft and format modern resumes quickly.
- **Aptitude Test:** Evaluate your cognitive and problem-solving skills.
- **Mock Interview:** Practice interface for simulated job interviews.
- **Job Suggestions:** Tailored job recommendations based on your profile.
- **Salary Benchmarking:** Market salary comparisons for various job roles.
- **Skill Gap Analyzer:** Analyzes user skills against market demands.
- **Learning Paths:** Suggested resources to bridge identified skill gaps.
- **ATS Linter:** Resume scoring and feedback system modeled after Applicant Tracking Systems.
