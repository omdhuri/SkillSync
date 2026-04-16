import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { SkillGapAnalyzer } from './pages/SkillGapAnalyzer';
import { Roadmap } from './pages/Roadmap';
import { JobSuggestions } from './pages/JobSuggestions';
import { ResumeBuilder } from './pages/ResumeBuilder';
import { AptitudeTest } from './pages/AptitudeTest';
import { MockInterview } from './pages/MockInterview';
import { LearningPaths } from './pages/LearningPaths';
import { AtsLinter } from './pages/AtsLinter';
import { Settings } from './pages/Settings';

export default function App() {
  const basename = '/';

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="resume-builder" element={<ResumeBuilder />} />
          <Route path="aptitude-test" element={<AptitudeTest />} />
          <Route path="mock-interview" element={<MockInterview />} />
          <Route path="job-suggestions" element={<JobSuggestions />} />
          <Route path="skill-gap-analyzer" element={<SkillGapAnalyzer />} />
          <Route path="learning-paths" element={<LearningPaths />} />
          <Route path="ats-linter" element={<AtsLinter />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
