import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const { signInWithGoogle, loading, session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already logged in → go to dashboard
  if (session) return <Navigate to="/dashboard" replace />;

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError('Failed to sign in. Please try again.');
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden font-sans">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/15 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[30%] right-[20%] w-[35%] h-[35%] rounded-full bg-amber-500/10 blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">
          
          {/* Logo + Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-14 h-14 flex items-center justify-center mb-4">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl" />
              <div className="relative bg-slate-900 border border-white/10 rounded-2xl w-14 h-14 flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 24 24" className="w-8 h-8 drop-shadow-sm" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 14 10 A 4 4 0 0 0 6 10 V 14 A 4 4 0 0 0 10 18 H 11" stroke="#6366f1" />
                  <path d="M 10 14 A 4 4 0 0 0 18 14 V 10 L 22 6" stroke="#f59e0b" />
                  <path d="M 17 6 L 22 6 L 22 11" stroke="#f59e0b" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">SkillSync</h1>
            <p className="text-slate-400 text-sm mt-1">Your AI-powered career co-pilot</p>
          </div>

          {/* Divider with text */}
          <div className="mb-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-white mb-1">Welcome back</h2>
              <p className="text-slate-400 text-sm">Sign in to continue your journey</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            id="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 font-semibold py-3.5 px-6 rounded-2xl transition-all duration-200 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
          </button>

          {/* Features preview */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-xs text-slate-500 mb-4 font-medium uppercase tracking-wider">What's inside</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: '🎯', label: 'Skill Gap Analysis' },
                { icon: '🗺️', label: 'Career Roadmap' },
                { icon: '📄', label: 'Resume Builder' },
                { icon: '💼', label: 'Job Matching' },
              ].map((feature) => (
                <div key={feature.label} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2.5">
                  <span className="text-base">{feature.icon}</span>
                  <span className="text-xs text-slate-300 font-medium">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-600 mt-6">
            By signing in, you agree to our{' '}
            <span className="text-slate-500 hover:text-slate-400 cursor-pointer transition-colors">Terms</span>
            {' '}and{' '}
            <span className="text-slate-500 hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
