import { useState } from 'react';
import { 
  Search, 
  UploadCloud, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ArrowRight,
  Briefcase,
  FileText,
  ChevronRight
} from 'lucide-react';

const MOCK_JOB_ROLE = "Frontend Developer (React)";
const MOCK_SKILLS_REQUIRED = [
  { name: "React.js", category: "Framework", importance: "High" },
  { name: "TypeScript", category: "Language", importance: "High" },
  { name: "Tailwind CSS", category: "Styling", importance: "Medium" },
  { name: "GraphQL", category: "API", importance: "Medium" },
  { name: "Jest", category: "Testing", importance: "Low" },
  { name: "Next.js", category: "Framework", importance: "Medium" },
  { name: "Redux", category: "State Management", importance: "Low" },
];

const MOCK_USER_SKILLS = [
  "React.js",
  "JavaScript",
  "Tailwind CSS",
  "HTML",
  "CSS",
  "Git",
  "Redux"
];

export function SkillGapAnalyzer() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(true); // Default to true for demo purposes

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 1500);
  };

  const matchedSkills = MOCK_SKILLS_REQUIRED.filter(s => MOCK_USER_SKILLS.includes(s.name));
  const missingSkills = MOCK_SKILLS_REQUIRED.filter(s => !MOCK_USER_SKILLS.includes(s.name));
  
  const matchPercentage = Math.round((matchedSkills.length / MOCK_SKILLS_REQUIRED.length) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Skill-Gap Analyzer</h1>
          <p className="text-slate-500 mt-1">Compare your resume against real-world job requirements.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              Your Profile
            </h3>
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
              <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
              <div className="text-sm font-medium text-slate-900">Upload Resume</div>
              <div className="text-xs text-slate-500 mt-1">PDF or DOCX up to 5MB</div>
            </div>
            <div className="mt-4 p-3 bg-slate-50 rounded-md border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">felix_resume_v2.pdf</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-500" />
              Target Role
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Job Title</label>
                <input 
                  type="text" 
                  defaultValue={MOCK_JOB_ROLE}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Industry / Company (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. FinTech, Stripe"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Run Diff Analysis
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {showResults ? (
            <div className="space-y-6">
              {/* Score Card */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Sync State: {matchPercentage}% Match</h2>
                  <p className="text-sm text-slate-500 mt-1">You are {missingSkills.length} skills away from qualifying for this role.</p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-indigo-100 flex items-center justify-center relative">
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="4"
                      strokeDasharray={`${matchPercentage}, 100`}
                    />
                  </svg>
                  <span className="text-lg font-bold text-indigo-600">{matchPercentage}%</span>
                </div>
              </div>

              {/* Diff View */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Skill Graph Diff</h3>
                  <div className="flex gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Present ({matchedSkills.length})
                    </span>
                    <span className="flex items-center gap-1 text-rose-600">
                      <XCircle className="w-3.5 h-3.5" /> Missing ({missingSkills.length})
                    </span>
                  </div>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {MOCK_SKILLS_REQUIRED.map((skill, idx) => {
                    const isMatched = MOCK_USER_SKILLS.includes(skill.name);
                    return (
                      <div key={idx} className={`px-6 py-3 flex items-center justify-between ${isMatched ? 'bg-white' : 'bg-rose-50/30'}`}>
                        <div className="flex items-center gap-3">
                          {isMatched ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-500" />
                          )}
                          <div>
                            <div className={`text-sm font-medium ${isMatched ? 'text-slate-900' : 'text-rose-900'}`}>
                              {skill.name}
                            </div>
                            <div className="text-xs text-slate-500">{skill.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            skill.importance === 'High' ? 'bg-amber-100 text-amber-700' :
                            skill.importance === 'Medium' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {skill.importance} Priority
                          </span>
                          {!isMatched && (
                            <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                              Learn <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Area */}
              {missingSkills.length > 0 && (
                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-semibold text-indigo-900">Action Required</h4>
                    <p className="text-sm text-indigo-700 mt-1 mb-4">
                      You are missing {missingSkills.filter(s => s.importance === 'High').length} high-priority skills. We recommend adding these to your learning roadmap before applying.
                    </p>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors flex items-center gap-2">
                      Generate Learning Roadmap <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <Search className="w-12 h-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Ready to Analyze</h3>
              <p className="text-sm text-slate-500 max-w-sm">
                Upload your resume and specify a target role to see how your skills stack up against real-world requirements.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
