import { Link } from 'react-router-dom';
import { 
  Map, 
  FileText, 
  BrainCircuit, 
  Mic, 
  Briefcase, 
  Search, 
  GraduationCap, 
  CheckSquare,
  ArrowRight,
  TrendingUp,
  Target
} from 'lucide-react';

const modules = [
  {
    name: 'Roadmap',
    description: 'Step by step personalized career path.',
    href: '/roadmap',
    icon: Map,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50 text-blue-600',
  },
  {
    name: 'Resume Maker',
    description: 'AI builds resume automatically.',
    href: '/resume-builder',
    icon: FileText,
    color: 'bg-emerald-500',
    lightColor: 'bg-emerald-50 text-emerald-600',
  },
  {
    name: 'Aptitude Test',
    description: 'AI powered unlimited practice tests.',
    href: '/aptitude-test',
    icon: BrainCircuit,
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50 text-orange-600',
  },
  {
    name: 'Mock Interview',
    description: 'Practice with AI interviewer anytime.',
    href: '/mock-interview',
    icon: Mic,
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50 text-purple-600',
  },
  {
    name: 'Job Suggestions',
    description: 'AI matched job and internship cards.',
    href: '/job-suggestions',
    icon: Briefcase,
    color: 'bg-rose-500',
    lightColor: 'bg-rose-50 text-rose-600',
  },
  {
    name: 'Skill Gap',
    description: 'AI scans resume vs job description.',
    href: '/skill-gap-analyzer',
    icon: Search,
    color: 'bg-yellow-500',
    lightColor: 'bg-yellow-50 text-yellow-600',
  },
  {
    name: 'Learning Paths',
    description: 'Free courses from top platforms.',
    href: '/learning-paths',
    icon: GraduationCap,
    color: 'bg-pink-500',
    lightColor: 'bg-pink-50 text-pink-600',
  },
  {
    name: 'ATS Checker',
    description: 'ATS compatibility score meter.',
    href: '/ats-linter',
    icon: CheckSquare,
    color: 'bg-indigo-500',
    lightColor: 'bg-indigo-50 text-indigo-600',
  },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, Felix</h1>
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
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-700"></div>
            
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
                      You are 3 skills away from qualifying for <span className="font-semibold text-slate-900">Frontend Developer</span> roles. Focus on <span className="font-medium text-indigo-600">TypeScript</span> next to boost your score to 85%.
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
                  <div className="text-3xl font-bold text-slate-900">12<span className="text-lg text-slate-400">/15</span></div>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-3">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
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
