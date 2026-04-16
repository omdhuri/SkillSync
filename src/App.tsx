import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { SkillGapAnalyzer } from './pages/SkillGapAnalyzer';
import { Roadmap } from './pages/Roadmap';
import { JobSuggestions } from './pages/JobSuggestions';
import { ResumeBuilder } from './pages/ResumeBuilder';
import { AptitudeTest } from './pages/AptitudeTest';
import { LearningPaths } from './pages/LearningPaths';
import { Settings } from './pages/Settings';

// Loading spinner while auth state resolves
function AuthLoading() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Redirect to login if not authenticated
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return <AuthLoading />;
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="resume-builder" element={<ResumeBuilder />} />
        <Route path="aptitude-test" element={<AptitudeTest />} />
        <Route path="job-suggestions" element={<JobSuggestions />} />
        <Route path="skill-gap-analyzer" element={<SkillGapAnalyzer />} />
        <Route path="learning-paths" element={<LearningPaths />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
