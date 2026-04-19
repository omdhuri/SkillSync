import { Link } from 'react-router-dom';
import {
  Map,
  FileText,
  BrainCircuit,
  Briefcase,
  Search,
  GraduationCap,
  ArrowRight,
  TrendingUp,
  Target
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const modules = [
  {
    name: 'Roadmap',
    description: 'Step by step personalized career path.',
    href: '/roadmap',
    icon: Map,
    lightColor: 'bg-blue-50 text-blue-600',
  },
  {
    name: 'Resume Maker',
    description: 'Build professional resumes automatically.',
    href: '/resume-builder',
    icon: FileText,
    lightColor: 'bg-emerald-50 text-emerald-600',
  },
  {
    name: 'Aptitude Test',
    description: 'Unlimited practice tests for top roles.',
    href: '/aptitude-test',
    icon: BrainCircuit,
    lightColor: 'bg-orange-50 text-orange-600',
  },
  {
    name: 'Job Suggestions',
    description: 'Personalized job and internship recommendations.',
    href: '/job-suggestions',
    icon: Briefcase,
    lightColor: 'bg-rose-50 text-rose-600',
  },
  {
    name: 'Skill Gap',
    description: 'AI scans resume vs job description.',
    href: '/skill-gap-analyzer',
    icon: Search,
    lightColor: 'bg-yellow-50 text-yellow-600',
  },
  {
    name: 'Learning Paths',
    description: 'Free courses from top platforms.',
    href: '/learning-paths',
    icon: GraduationCap,
    lightColor: 'bg-pink-50 text-pink-600',
  },
];

export function Dashboard() {
  const { user, profile } = useAuth();

  // Priority: Google/auth metadata (ground truth) > Supabase DB profile > email prefix
  // Note: profile?.full_name may contain stale placeholder data if user never updated Settings
  const authName = user?.user_metadata?.full_name || user?.user_metadata?.name;
  const firstName = (
    authName ||
    profile?.full_name ||
    user?.email?.split('@')[0] ||
    'there'
  ).split(' ')[0];

  const skillsCount = profile?.skills?.length ?? 0;
  const targetRole = profile?.target_role || 'your target role';
  const skillsTotal = Math.max(skillsCount + 3, 15);
  const skillsPercent = skillsCount > 0
    ? `${Math.min(Math.round((skillsCount / skillsTotal) * 100), 100)}%`
    : '0%';

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Welcome to your Dashboard, <span className="text-indigo-600">{firstName}</span> 👋
        </h1>
        <p className="text-slate-500 mt-1 text-lg">Here's your career progress overview. What would you like to focus on today?</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">

        {/* Left Column: Analytics & Metrics */}
        <div className="w-full xl:w-[35%] flex flex-col gap-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-semibold text-slate-900">Analytics & Progress</h2>
          </div>

          {/* Large Card: Sync Score & Actionable Insight */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm rounded-3xl p-8 flex flex-col relative overflow-hidden group flex-1 min-h-[320px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-700" />

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Sync Score</h2>
                  <p className="text-sm text-slate-500">Market Readiness</p>
                </div>
              </div>
              <div className="text-4xl font-bold text-indigo-600">78%</div>
            </div>

            <div className="flex-1 relative z-10 flex flex-col justify-end">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 border border-white/50 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Actionable Insight</h4>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      {skillsCount > 0 ? (
                        <>
                          You have{' '}
                          <span className="font-semibold text-slate-900">{skillsCount} skills</span>{' '}
                          listed. Keep levelling up towards{' '}
                          <span className="font-semibold text-slate-900">{targetRole}</span> — add{' '}
                          <span className="font-medium text-indigo-600">TypeScript</span> to boost your score.
                        </>
                      ) : (
                        <>
                          Add your skills in{' '}
                          <span className="font-semibold text-slate-900">Settings</span> to unlock
                          personalized insights for{' '}
                          <span className="font-medium text-indigo-600">{targetRole}</span> roles.
                        </>
                      )}
                    </p>
                    <Link to="/learning-paths" className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 mt-3">
                      View Learning Path <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Small Metrics Sub-grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Medium Card: Active Applications */}
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">Active Apps</div>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-slate-900">4</div>
                  <div className="text-xs text-emerald-600 font-medium flex items-center gap-1 mb-1.5">
                    <TrendingUp className="w-3 h-3" /> +2
                  </div>
                </div>
              </div>
            </div>

            {/* Medium Card: Skills Mastered */}
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm rounded-3xl p-6 flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                  <BrainCircuit className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-500 mb-1">Skills Mastered</div>
                <div className="flex items-end justify-between">
                  <div className="text-3xl font-bold text-slate-900">
                    {skillsCount}
                    <span className="text-lg text-slate-400">/{skillsTotal}</span>
                  </div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: skillsPercent }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Features / Modules */}
        <div className="w-full xl:w-[65%] flex flex-col gap-6">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-semibold text-slate-900">Career Modules</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <Link
                key={module.name}
                to={module.href}
                className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm rounded-3xl p-6 hover:shadow-md hover:border-indigo-200 transition-all duration-300 group flex flex-col justify-between min-h-[160px]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${module.lightColor} group-hover:scale-110 transition-transform duration-300`}>
                    <module.icon className="w-6 h-6" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 mb-1">{module.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">{module.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
