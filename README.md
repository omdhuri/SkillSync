<div align="center">
  
  # 🚀 SkillSync: AI-Powered Career Management System

  <p align="center">
    A comprehensive, intelligent platform designed to streamline career progression with personalized roadmaps, resume building, and skill analysis.
  </p>

  <div>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </div>
</div>

<br />

## 🌟 Overview

**SkillSync** is a modern, AI-integrated web application built to empower users in managing their career trajectories. By combining dynamic assessments, intelligent resume parsing, and market-driven data, SkillSync acts as a personal career advisor.

Whether you are optimizing your CV for Applicant Tracking Systems (ATS), practicing for an upcoming interview, or figuring out your next learning milestone, SkillSync provides the necessary tools in one fluid, beautiful interface.

---

## 🔥 Key Features

### 🗺️ Interactive Career Roadmaps
- **23 Career Paths:** Choose from Frontend, Backend, Full-Stack, Data Science, DevOps, and 18+ other career tracks.
- **Progress Tracking:** Mark topics as complete and track your learning progress with visual progress bars.
- **PDF Downloads:** Download detailed roadmap PDFs for each career path with complete learning guides.
- **Auto-Save:** Your progress is automatically saved locally, so you can pick up where you left off.

### 📄 Intelligent Resume Builder
- **Dynamic Builder:** Craft beautifully formatted, modern resumes in real-time.
- **PDF Export:** Instantly download your polished resume as a high-quality PDF.
- **AI Suggestions:** Get AI-powered suggestions to improve your resume content.

### 🧠 General Aptitude Test
- **Adaptive Testing:** Evaluate your cognitive, logical, and problem-solving skills through a generalized aptitude test.
- **Instant Analytics:** Receive immediate performance breakdowns, including accuracy, category strengths, and weak areas.
- **Sleek UI:** Enjoy a premium testing interface with animations, timer tracking, and easy navigation.

### 📊 Skill Gap Analyzer & Learning Paths
- **Market Analysis:** Compare your current skill set against active market demands for your desired role.
- **Tailored Upskilling:** Get personalized, curated resources and learning paths to bridge identified skill gaps efficiently.
- **YouTube Integration:** Access curated video tutorials for each skill from top educators.

### 💼 Job Suggestions
- **Role Recommendations:** Discover roles tailored to your unique profile and career goals.
- **Market Insights:** Compare industry standard salaries across various job roles to ensure you know your worth.

### 📈 Visual Dashboard
- **Sync Score:** Track your market readiness with a personalized career score.
- **Progress Metrics:** Monitor skills mastered, active applications, and roadmap progress at a glance.

---

## 🛠️ Technical Workflow & Architecture

SkillSync utilizes a modern client-heavy architecture, leveraging the power of **Vite** and **React** for lightning-fast UI delivery.

1. **Client-Side Rendering (CSR):** The entire application interface and routing are handled client-side via React and React Router DOM, ensuring smooth page transitions and a native-app feel.
2. **AI Inference & Data Processing:** Heavy cognitive tasks, such as resume parsing, skill gap analysis, and job matching, are powered by integrating the **Google Gemini API**. Prompts and contexts are constructed client-side and sent directly to the AI model for real-time natural language processing.
3. **Local Persistence:** User progress (roadmap completion, settings) is stored in `localStorage` for instant access and offline capability.
4. **State & Analytics:** Visual analytics and test states are managed dynamically within React hooks, providing immediate feedback loops (like the Aptitude Test results).

---

## 💻 Tech Stack

### Frontend Core
- **React 19:** The bleeding-edge UI library for composable components.
- **Vite (v6):** Next-generation frontend tooling for ultra-fast HMR and optimized builds.
- **TypeScript:** Ensuring strict type safety and developer confidence.

### Styling & Animations
- **Tailwind CSS (v4):** Utility-first CSS framework for rapid UI development and premium aesthetics.
- **Lucide React:** Clean, beautiful SVG icons.

### Data Visualization & Utilities
- **Recharts:** Composable charting library used for the Aptitude Test analytics and Salary Benchmarking.
- **React Router DOM (v7):** For declarative routing and navigation.
- **React PDF:** Client-side document generation for the Resume Builder.

### AI Integration
- **Google Gemini API (`@google/genai`):** The core intelligence behind the resume parsing, skill analysis, and job matching.

### Local Storage
- **localStorage:** User progress and settings stored client-side for instant access.

---

## 🚀 Getting Started

Follow these steps to set up SkillSync locally on your machine.

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **Google Gemini API Key** (Required for AI features)

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd SkillSync
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   You must provide an API key for the AI features to work.
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and assign your Gemini API Key:
     ```env
     GEMINI_API_KEY=your_actual_api_key_here
     ```

### Development

Start the Vite development server:
```bash
npm run dev
```
Navigate to `http://localhost:3000` (or the port specified in your console) to view the application.

### Building for Production

To create an optimized production build:
```bash
npm run build
```

To preview the built application locally:
```bash
npm run preview
```

### Formatting & Linting

To ensure codebase quality and run TypeScript checks:
```bash
npm run lint
```

---

## 🤝 Contributing

Contributions are always welcome! If you're interested in improving SkillSync, feel free to fork the repository, make your changes, and submit a Pull Request.

---

<div align="center">
  <p>Built with ❤️ for modern career development.</p>
</div>
