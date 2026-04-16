import { useState, useRef } from 'react';
import {
  Search,
  UploadCloud,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Briefcase,
  FileText,
  ChevronRight,
  Sparkles,
  Target,
  X
} from 'lucide-react';

const JOB_ROLES = [
  { title: "Frontend Developer (React)", skills: [
    { name: "React.js", category: "Framework", importance: "High" as const },
    { name: "TypeScript", category: "Language", importance: "High" as const },
    { name: "Tailwind CSS", category: "Styling", importance: "Medium" as const },
    { name: "GraphQL", category: "API", importance: "Medium" as const },
    { name: "Jest", category: "Testing", importance: "Low" as const },
    { name: "Next.js", category: "Framework", importance: "Medium" as const },
    { name: "Redux", category: "State Management", importance: "Low" as const },
  ]},
  { title: "Backend Developer (Node.js)", skills: [
    { name: "Node.js", category: "Runtime", importance: "High" as const },
    { name: "TypeScript", category: "Language", importance: "High" as const },
    { name: "PostgreSQL", category: "Database", importance: "High" as const },
    { name: "REST API", category: "Architecture", importance: "Medium" as const },
    { name: "Docker", category: "DevOps", importance: "Medium" as const },
    { name: "Redis", category: "Caching", importance: "Low" as const },
    { name: "GraphQL", category: "API", importance: "Low" as const },
  ]},
  { title: "Full Stack Developer", skills: [
    { name: "React.js", category: "Framework", importance: "High" as const },
    { name: "Node.js", category: "Runtime", importance: "High" as const },
    { name: "TypeScript", category: "Language", importance: "High" as const },
    { name: "PostgreSQL", category: "Database", importance: "Medium" as const },
    { name: "Tailwind CSS", category: "Styling", importance: "Medium" as const },
    { name: "Docker", category: "DevOps", importance: "Low" as const },
    { name: "AWS", category: "Cloud", importance: "Medium" as const },
  ]},
  { title: "Data Scientist", skills: [
    { name: "Python", category: "Language", importance: "High" as const },
    { name: "Pandas", category: "Library", importance: "High" as const },
    { name: "NumPy", category: "Library", importance: "High" as const },
    { name: "Scikit-learn", category: "ML", importance: "Medium" as const },
    { name: "SQL", category: "Database", importance: "Medium" as const },
    { name: "TensorFlow", category: "ML", importance: "Low" as const },
    { name: "Matplotlib", category: "Visualization", importance: "Low" as const },
  ]},
];

// Mock extracted skills from uploaded resume
const EXTRACTED_SKILLS = [
  "React.js",
  "JavaScript",
  "Tailwind CSS",
  "HTML",
  "CSS",
  "Git",
  "Redux",
  "Node.js",
  "MongoDB"
];

export function SkillGapAnalyzer() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedRole, setSelectedRole] = useState(JOB_ROLES[0]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate file processing
      setTimeout(() => {
        setUploadedFile(file);
        setIsUploading(false);
        // Auto-extract skills after upload
        setUserSkills(EXTRACTED_SKILLS);
      }, 1500);
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const role = JOB_ROLES.find(r => r.title === e.target.value);
    if (role) setSelectedRole(role);
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setShowResults(false);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUserSkills([]);
    setShowResults(false);
  };

  const matchedSkills = selectedRole.skills.filter(s => userSkills.includes(s.name));
  const missingSkills = selectedRole.skills.filter(s => !userSkills.includes(s.name));
  const matchPercentage = Math.round((matchedSkills.length / selectedRole.skills.length) * 100);

  const getPriorityColor = (importance: string) => {
    switch (importance) {
      case 'High': return 'bg-amber-100 text-amber-700';
      case 'Medium': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Skill-Gap Analyzer</h1>
        <p className="text-slate-500 mt-1">Compare your resume against real-world job requirements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          {/* Upload Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              Your Resume
            </h3>

            {!uploadedFile ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <UploadCloud className="w-8 h-8 text-slate-400 mb-2 group-hover:text-indigo-500 transition-colors" />
                <div className="text-sm font-medium text-slate-900">Click to upload</div>
                <div className="text-xs text-slate-500 mt-1">PDF or DOCX up to 5MB</div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">{uploadedFile.name}</div>
                      <div className="text-xs text-slate-500">{(uploadedFile.size / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveFile}
                    className="p-1 hover:bg-white rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                  </button>
                </div>

                {/* Extracted Skills */}
                <div className="mt-3 pt-3 border-t border-emerald-200">
                  <div className="text-xs font-medium text-slate-600 mb-2">Extracted Skills ({userSkills.length})</div>
                  <div className="flex flex-wrap gap-1">
                    {userSkills.slice(0, 6).map(skill => (
                      <span key={skill} className="text-[10px] px-2 py-0.5 bg-white text-slate-600 rounded-full border border-emerald-200">
                        {skill}
                      </span>
                    ))}
                    {userSkills.length > 6 && (
                      <span className="text-[10px] px-2 py-0.5 bg-white text-slate-400 rounded-full border border-emerald-200">
                        +{userSkills.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Target Role Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-500" />
              Target Role
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Job Title</label>
                <select
                  value={selectedRole.title}
                  onChange={handleRoleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {JOB_ROLES.map(role => (
                    <option key={role.title} value={role.title}>{role.title}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAnalyze}
                disabled={!uploadedFile || isAnalyzing}
                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-md text-sm transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-200"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Run Analysis
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-indigo-900">Pro Tip</h4>
                <p className="text-xs text-indigo-700 mt-1">
                  Upload your latest resume to get instant insights on how well you match your dream job requirements.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          {showResults ? (
            <div className="space-y-6">
              {/* Score Card */}
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-indigo-200" />
                      <h2 className="text-lg font-semibold">Analysis Complete</h2>
                    </div>
                    <p className="text-indigo-100 text-sm mt-1">
                      You match <span className="font-bold text-white">{matchPercentage}%</span> of requirements for <span className="font-medium">{selectedRole.title}</span>
                    </p>
                  </div>
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-2xl font-bold">{matchPercentage}%</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/20">
                  <div>
                    <div className="text-2xl font-bold">{matchedSkills.length}</div>
                    <div className="text-xs text-indigo-200">Matched</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{missingSkills.length}</div>
                    <div className="text-xs text-indigo-200">Missing</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{selectedRole.skills.filter(s => s.importance === 'High').length}</div>
                    <div className="text-xs text-indigo-200">High Priority</div>
                  </div>
                </div>
              </div>

              {/* Skills Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Matched Skills */}
                <div className="bg-white rounded-xl border border-emerald-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 bg-emerald-50 border-b border-emerald-100 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-semibold text-emerald-900">Your Skills ({matchedSkills.length})</h3>
                  </div>
                  <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
                    {matchedSkills.map((skill, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/50">
                        <div>
                          <div className="text-sm font-medium text-emerald-900">{skill.name}</div>
                          <div className="text-xs text-emerald-600">{skill.category}</div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getPriorityColor(skill.importance)}`}>
                          {skill.importance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="bg-white rounded-xl border border-rose-200 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 bg-rose-50 border-b border-rose-100 flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <h3 className="text-sm font-semibold text-rose-900">Skills to Learn ({missingSkills.length})</h3>
                  </div>
                  <div className="p-3 space-y-2 max-h-80 overflow-y-auto">
                    {missingSkills.map((skill, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-rose-50/50">
                        <div>
                          <div className="text-sm font-medium text-rose-900">{skill.name}</div>
                          <div className="text-xs text-rose-600">{skill.category}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getPriorityColor(skill.importance)}`}>
                            {skill.importance}
                          </span>
                          <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5">
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Full Skill Graph */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">Complete Skill Breakdown</h3>
                  <div className="flex gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="w-3.5 h-3.5" /> You have
                    </span>
                    <span className="flex items-center gap-1 text-rose-600">
                      <XCircle className="w-3.5 h-3.5" /> Missing
                    </span>
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {selectedRole.skills.map((skill, idx) => {
                    const hasSkill = userSkills.includes(skill.name);
                    return (
                      <div key={idx} className={`px-6 py-3 flex items-center justify-between ${hasSkill ? 'bg-white' : 'bg-rose-50/30'}`}>
                        <div className="flex items-center gap-3">
                          {hasSkill ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-500" />
                          )}
                          <div>
                            <div className={`text-sm font-medium ${hasSkill ? 'text-slate-900' : 'text-rose-900'}`}>
                              {skill.name}
                            </div>
                            <div className="text-xs text-slate-500">{skill.category}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(skill.importance)}`}>
                            {skill.importance} Priority
                          </span>
                          {!hasSkill && (
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

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-xl bg-gradient-to-br from-slate-50 to-indigo-50/50">
              <div className="w-20 h-20 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6">
                <Search className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Ready to Analyze</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-6">
                Upload your resume and select a target role to discover skill gaps and get personalized learning recommendations.
              </p>

              {!uploadedFile && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-md text-sm transition-all flex items-center gap-2 shadow-md shadow-indigo-200"
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload Resume
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
