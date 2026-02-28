import { CheckCircle2, Circle, Lock, ArrowRight, BookOpen, Code, FileText, Briefcase } from 'lucide-react';

const MILESTONES = [
  {
    id: 1,
    title: 'Profile Setup & Resume Parsing',
    description: 'Upload your current resume to establish your baseline Skill Graph.',
    status: 'completed',
    icon: FileText,
    date: 'Oct 12',
  },
  {
    id: 2,
    title: 'Skill Gap Analysis',
    description: 'Compare your baseline against your target role (Frontend Developer).',
    status: 'completed',
    icon: Search,
    date: 'Oct 13',
  },
  {
    id: 3,
    title: 'Master React Fundamentals',
    description: 'Complete the curated learning path for React hooks, context, and state management.',
    status: 'current',
    icon: BookOpen,
    progress: 65,
  },
  {
    id: 4,
    title: 'Build Portfolio Project',
    description: 'Develop a full-stack application using Next.js and Tailwind CSS.',
    status: 'locked',
    icon: Code,
  },
  {
    id: 5,
    title: 'ATS Resume Optimization',
    description: 'Refactor your resume using the AI Builder to pass ATS parsers.',
    status: 'locked',
    icon: FileText,
  },
  {
    id: 6,
    title: 'Mock Interview Gauntlet',
    description: 'Pass 3 technical mock interviews with a score of 80% or higher.',
    status: 'locked',
    icon: Mic,
  },
  {
    id: 7,
    title: 'Start Applying',
    description: 'Unlock high-match job suggestions and begin the application process.',
    status: 'locked',
    icon: Briefcase,
  },
];

import { Search, Mic } from 'lucide-react'; // Import missing icons

export function Roadmap() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Milestone Roadmap</h1>
        <p className="text-slate-500 mt-1">Your personalized path from learning to hired.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <div className="relative border-l-2 border-slate-100 ml-4 space-y-10">
          {MILESTONES.map((milestone, index) => {
            const isCompleted = milestone.status === 'completed';
            const isCurrent = milestone.status === 'current';
            const isLocked = milestone.status === 'locked';

            return (
              <div key={milestone.id} className="relative pl-8">
                {/* Timeline Node */}
                <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full flex items-center justify-center bg-white ${
                  isCompleted ? 'text-emerald-500' : 
                  isCurrent ? 'text-indigo-600 ring-4 ring-indigo-50' : 
                  'text-slate-300'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 bg-white" />
                  ) : isCurrent ? (
                    <Circle className="w-4 h-4 fill-indigo-600" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </div>

                {/* Content */}
                <div className={`transition-opacity ${isLocked ? 'opacity-50' : 'opacity-100'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-base font-semibold ${isCurrent ? 'text-indigo-900' : 'text-slate-900'}`}>
                      {milestone.title}
                    </h3>
                    {milestone.date && (
                      <span className="text-xs font-medium text-slate-400">{milestone.date}</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{milestone.description}</p>
                  
                  {isCurrent && (
                    <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                      <div className="flex items-center justify-between text-xs font-medium text-indigo-900 mb-2">
                        <span>Progress</span>
                        <span>{milestone.progress}%</span>
                      </div>
                      <div className="w-full bg-indigo-200/50 rounded-full h-1.5 mb-4">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${milestone.progress}%` }}></div>
                      </div>
                      <button className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md transition-colors flex items-center gap-2">
                        Continue Learning <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {isLocked && (
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mt-2">
                      <Lock className="w-3 h-3" />
                      Complete previous milestones to unlock
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
