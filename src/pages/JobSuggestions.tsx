import { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, Star, ExternalLink, Filter, Search, CheckCircle2, ChevronDown, X as CloseIcon, LayoutGrid, GraduationCap, Target } from 'lucide-react';
import { cn } from '../components/Layout';

// Placeholder for future Job Search API integration (e.g. Adzuna, JSearch)
const API_CONFIG = {
  active: false,
  endpoint: '',
  apiKey: '',
  provider: 'local' // Can be 'adzuna', 'jsearch', etc.
};

const USER_SKILLS = ['React', 'TypeScript', 'Tailwind', 'Next.js'];

// Fuzzy Matching for Roles (matches title keywords)
const FUZZY_ROLE_MAPPING: Record<string, string[]> = {
  'Frontend': ['frontend', 'react', 'ui', 'web', 'javascript', 'next.js', 'application developer'],
  'Backend': ['backend', 'node', 'java', 'python', 'postgresql', 'apis', 'database', 'system engineer'],
  'Fullstack': ['fullstack', 'software engineer', 'developer', 'software engineer'],
  'Product Designer': ['designer', 'ux', 'ui', 'figma', 'product design', 'visual designer'],
  'DevOps': ['devops', 'sre', 'infrastructure', 'cloud', 'aws', 'docker', 'kubernetes', 'azure', 'specialist']
};

const normalizeSkill = (s: string) => s.toLowerCase().trim().replace(/^postgres$/, 'postgresql');

export function JobSuggestions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredJobId, setHoveredJobId] = useState<string | number | null>(null);
  const [tooltipUp, setTooltipUp] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState<string | number | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<(string | number)[]>([]);

  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchFilters, setSearchFilters] = useState({
    role: 'All Roles',
    level: 'Any Level',
    goal: 'Both',
    skills: []
  });

  const [skillInput, setSkillInput] = useState('');

  const handleFilterChange = (key: keyof typeof searchFilters, value: any) => {
    setSearchFilters(prev => {
      const newFilters = { ...prev, [key]: value };

      // Auto-highlight Internships for Students
      if (key === 'level' && value === 'Fresher/Student') {
        newFilters.goal = 'Internship';
      }

      return newFilters;
    });
  };

  const addSkill = (skill: string) => {
    if (skill && !searchFilters.skills.includes(skill)) {
      handleFilterChange('skills', [...searchFilters.skills, skill]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    handleFilterChange('skills', searchFilters.skills.filter(s => s !== skillToRemove));
  };

  const calculateMatch = (requiredSkills: string[]) => {
    const currentSkills = searchFilters.skills;

    const matched = requiredSkills.filter(skill =>
      currentSkills.some(userSkill => normalizeSkill(userSkill) === normalizeSkill(skill))
    );
    const missing = requiredSkills.filter(skill =>
      !currentSkills.some(userSkill => normalizeSkill(userSkill) === normalizeSkill(skill))
    );

    const percent = requiredSkills.length > 0
      ? Math.round((matched.length / requiredSkills.length) * 100)
      : 0;

    return { percent, matched, missing };
  };

  useEffect(() => {
    // 1. Immediate Resets & Cache Wipe
    localStorage.clear(); // Force wipe to ensure we start fresh on every goal switch for now
    setJobs([]);
    setIsLoading(true);
    // Clear skill filters for a fresh experience in the new category
    setSearchFilters(prev => ({ ...prev, skills: [] }));
    
    // 2. Dynamic Query Selection
    const getQuery = () => {
      if (searchFilters.goal === 'Job') return 'Software Developer India';
      if (searchFilters.goal === 'Internship') return 'Software Intern India';
      return 'Software Developer and Intern India';
    };

    // 3. Trigger Fetch
    fetchJobs(getQuery());
  }, [searchFilters.goal]);

  const fetchJobs = async (query = 'Software Developer or Intern India') => {
    setIsLoading(true);

    // 1. Check Cache First (Goal-Specific)
    const CACHE_KEY = `jobs_cache_${searchFilters.goal.toUpperCase()}_${query.replace(/\s+/g, '_').toLowerCase()}`;
    const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes
    const cachedData = localStorage.getItem(CACHE_KEY);

    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        setJobs(data);
        setIsLoading(false);
        return;
      }
    }

    try {
      // 2. Optimized Fetch with Field Limiting
      const fields = 'job_id,job_title,employer_name,employer_logo,job_city,job_state,job_country,job_employment_type,job_posted_at_datetime_utc,job_apply_link,job_description,job_highlights';
      const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=1&num_pages=1&fields=${fields}`;

      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': import.meta.env.VITE_RAPID_API_KEY || '',
          'x-rapidapi-host': 'jsearch.p.rapidapi.com'
        }
      };

      const response = await fetch(url, options);
      const data = await response.json();

      if (data.status === 'OK') {
        const mappedJobs = data.data.map((job: any) => ({
          id: job.job_id,
          title: job.job_title,
          company: job.employer_name,
          location: `${job.job_city || ''}${job.job_city && job.job_state ? ', ' : ''}${job.job_state || ''}${(!job.job_city && !job.job_state) ? (job.job_country || 'Remote') : ''}`,
          salary: job.job_min_salary && job.job_max_salary
            ? `${job.job_salary_currency === 'USD' ? '$' : job.job_salary_currency}${job.job_min_salary / 1000}k - ${job.job_max_salary / 1000}k`
            : 'Competitive',
          type: job.job_employment_type || 'Full-time',
          posted: job.job_posted_at_datetime_utc ? new Date(job.job_posted_at_datetime_utc).toLocaleDateString() : 'Recently',
          logo: job.employer_logo || `https://ui-avatars.com/api/?name=${job.employer_name}&background=random`,
          link: job.job_apply_link,
          description: job.job_description,
          skills: job.job_highlights?.Qualifications?.slice(0, 5) || [],
          requiredSkills: job.job_highlights?.Qualifications || []
        }));

        // 3. Update Cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: mappedJobs,
          timestamp: Date.now()
        }));

        setJobs(mappedJobs);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (jobId: string | number) => {
    setApplyingJobId(jobId);
    setTimeout(() => {
      setAppliedJobIds(prev => [...prev, jobId]);
      setApplyingJobId(null);
    }, 2000);
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSearchFilters({
      role: 'All Roles',
      level: 'Any Level',
      goal: 'Both',
      skills: []
    });
  };

  const getFilteredJobs = () => {
    const isStudent = searchFilters.level === 'Fresher/Student';

    const filtered = jobs.filter(job => {
      // 1. Preference Header - Role & Level Check
      // Strict Detection (Flexible Matching & Title Fallbacks)
      const normalizedType = (job.type || '').toUpperCase().replace(/[^A-Z]/g, '');
      const jobTitleLower = (job.title || '').toLowerCase();
      
      console.log(`Job Type Debug [${job.title}]:`, job.type);

      let isInternship = normalizedType.startsWith('INTERN');
      const isFullTime = normalizedType.startsWith('FULL');

      // Title Backup: If type is missing/generic but title says "Intern", count it as Internship
      if (!isInternship && (!normalizedType || normalizedType === 'OTHER')) {
        if (jobTitleLower.includes('intern')) {
          isInternship = true;
        }
      }

      if (searchFilters.role !== 'All Roles') {
        const keywords = FUZZY_ROLE_MAPPING[searchFilters.role] || [searchFilters.role.toLowerCase()];
        const matchesRole = keywords.some(keyword => jobTitleLower.includes(keyword));

        if (!matchesRole) return false;
      }

      // 2. Preference Header - Career Goal (Flexible Filtering)
      if (searchFilters.goal === 'Internship') {
        if (!isInternship) return false;
      } else if (searchFilters.goal === 'Job') {
        if (!isFullTime) return false;
      }
      
      // 3. Mandatory Skill Check (Hard Filter)
      // If skills are entered, the job MUST contain at least one of them in the title, description, or skills array
      if (searchFilters.skills.length > 0) {
        const hasAnyMatchedSkill = searchFilters.skills.some(skill => {
          const lowerSkill = skill.toLowerCase();
          const matchesTitle = job.title.toLowerCase().includes(lowerSkill);
          const matchesDesc = (job.description || '').toLowerCase().includes(lowerSkill);
          const matchesSkills = job.skills.some(jobSkill => jobSkill.toLowerCase().includes(lowerSkill));

          return matchesTitle || matchesDesc || matchesSkills;
        });
        if (!hasAnyMatchedSkill) return false;
      }

      // 4. Global Search query (checks both title and description)
      const lowerQuery = searchQuery.toLowerCase();
      const matchesSearch =
        job.title.toLowerCase().includes(lowerQuery) ||
        (job.description || '').toLowerCase().includes(lowerQuery);

      if (!matchesSearch) return false;

      return true;
    });

    // 5. Sort by Relevance (Matched skills count) and Student Priority
    const sorted = [...filtered].sort((a, b) => {
      if (searchFilters.skills.length > 0) {
        const calculateMatchCount = (job: any) => {
          return searchFilters.skills.filter(skill => {
            const lowerSkill = skill.toLowerCase();
            const matchesTitle = job.title.toLowerCase().includes(lowerSkill);
            const matchesDesc = (job.description || '').toLowerCase().includes(lowerSkill);
            const matchesSkills = job.skills.some(jobSkill => jobSkill.toLowerCase().includes(lowerSkill));
            return matchesTitle || matchesDesc || matchesSkills;
          }).length;
        };

        const aCount = calculateMatchCount(a);
        const bCount = calculateMatchCount(b);

        if (aCount !== bCount) return bCount - aCount;
      }

      // Secondary Sort: Prioritize Internships for Students
      if (isStudent) {
        const aIsIntern = a.title.toLowerCase().includes('intern') || a.type.toLowerCase().includes('intern');
        const bIsIntern = b.title.toLowerCase().includes('intern') || b.type.toLowerCase().includes('intern');
        if (aIsIntern && !bIsIntern) return -1;
        if (!aIsIntern && bIsIntern) return 1;
      }

      return 0;
    });

    return sorted;
  };

  const filteredJobs = getFilteredJobs();



  return (
    <div className="relative min-h-full py-8 px-4">
      {/* Background override to ensure the page has the correct color */}
      <div className="fixed inset-0 bg-[#F1F5F9] -z-10" />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page Title & Search Bar Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Job Suggestions</h1>
            <p className="text-slate-500 mt-1 text-base sm:text-lg">High-signal opportunities matched to your Skill Graph.</p>
          </div>

          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search roles, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-base shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 w-full sm:w-80 transition-all font-medium"
            />
          </div>
        </div>

        {/* Preference Header Controls */}
        <div className="bg-white py-4 px-4 sm:px-6 rounded-xl border border-slate-200 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8">
            {/* Role Selection */}
            <div className="w-full sm:w-64 space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Preferred Role</label>
              <div className="relative">
                <select
                  value={searchFilters.role}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                  className="w-full pl-4 pr-10 py-3 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-all cursor-pointer hover:bg-slate-100/50"
                >
                  <option value="All Roles">All</option>
                  <option>Frontend</option>
                  <option>Backend</option>
                  <option>Fullstack</option>
                  <option>Product Designer</option>
                  <option>DevOps</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Level Selection */}
            <div className="w-full sm:w-48 space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Level</label>
              <div className="relative">
                <select
                  value={searchFilters.level}
                  onChange={(e) => handleFilterChange('level', e.target.value)}
                  className="w-full pl-4 pr-10 py-3 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none transition-all cursor-pointer hover:bg-slate-100/50"
                >
                  <option value="Any Level">Any</option>
                  <option>Fresher/Student</option>
                  <option>Junior</option>
                  <option>Senior</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Career Goal Selection */}
            <div className="w-full sm:w-auto space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Goal</label>
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 w-full sm:w-fit">
                {['Job', 'Internship', 'Both'].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => handleFilterChange('goal', goal)}
                    className={cn(
                      "flex-1 sm:flex-none px-4 py-2 sm:py-1.5 rounded-lg text-xs font-bold transition-all",
                      searchFilters.goal === goal
                        ? "bg-white text-indigo-600 shadow-sm border border-slate-200/50"
                        : "text-slate-500 hover:text-slate-800"
                    )}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Integrated Skills Bar */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all max-w-[600px]">
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto no-scrollbar">
                {searchFilters.skills.map(skill => (
                  <span key={skill} className="flex items-center gap-1.5 pl-2.5 pr-1 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-black text-indigo-600 shadow-sm whitespace-nowrap">
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="p-0.5 hover:bg-indigo-50 hover:text-indigo-600 rounded transition-colors text-slate-400"
                    >
                      <CloseIcon className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder={searchFilters.skills.length === 0 ? "Add skills..." : "+ skill"}
                value={skillInput}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.endsWith(',')) {
                    const skill = val.slice(0, -1).trim();
                    if (skill) addSkill(skill);
                  } else {
                    setSkillInput(val);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill(skillInput.trim());
                  }
                }}
                className="flex-1 min-w-[120px] bg-transparent border-none focus:ring-0 text-sm py-1 px-2 text-slate-600 placeholder:text-slate-400 font-bold"
              />
            </div>
          </div>
        </div>

        {/* Job Listings Container */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
              <p className="text-slate-500 font-bold">Fetching latest opportunities...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-[2rem] border-2 border-slate-200 border-dashed p-20 flex flex-col items-center text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                <Search className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No matches found</h3>
              <p className="text-slate-500 max-w-md text-lg mb-10">
                Try adjusting your filters or adding different skills to see more opportunities.
              </p>
              <button
                onClick={resetAllFilters}
                className="flex items-center gap-2 bg-indigo-600 text-white font-bold py-4 px-10 rounded-[1.25rem] hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 active:scale-95 text-lg"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                  {/* Left Column: Logo & Header Info (Always Row on Small Screens) */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-14 h-14 rounded-xl border border-slate-100 overflow-hidden bg-white flex-shrink-0 shadow-sm">
                      <img src={job.logo} alt={job.company} className="w-full h-full object-contain p-2.5" onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${job.company}&background=random`;
                      }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate leading-tight">
                          {job.title}
                        </h3>
                        <div className="text-sm font-semibold text-slate-500 mt-0.5">{job.company}</div>
                      </div>

                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-y-2 gap-x-4 mt-3 text-slate-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500/70" />
                          <span className="text-[11px] font-bold uppercase tracking-wide truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-3.5 h-3.5 text-indigo-500/70" />
                          <span className="text-[11px] font-bold uppercase tracking-wide truncate">{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-3.5 h-3.5 text-indigo-500/70" />
                          <span className="text-[11px] font-bold uppercase tracking-wide truncate">{job.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-3.5 h-3.5 text-indigo-500/70" />
                          <span className="text-[11px] font-bold uppercase tracking-wide truncate">Posted {job.posted}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column/Bottom Row: Actions & Skills */}
                  <div className="flex flex-col gap-4 mt-2 sm:mt-0 sm:items-end sm:min-w-[200px]">
                    <div className="flex flex-wrap items-center sm:justify-end gap-1.5">
                      {job.skills.map(skill => (
                        <span key={skill} className="px-2 py-0.5 bg-slate-50 text-[10px] font-black text-slate-400 rounded-md border border-slate-100 uppercase tracking-tighter">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto mt-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100/60 transition-all">
                      {searchFilters.skills.length > 0 && (() => {
                      const { percent, matched, missing } = calculateMatch(job.requiredSkills);
                      const isHighMatch = percent >= 80;
                      return (
                        <div className="relative">
                          <div
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.getBoundingClientRect();
                              const spaceBelow = window.innerHeight - rect.bottom;
                              setTooltipUp(spaceBelow < 180); // Flip if less than 180px available
                              setHoveredJobId(job.id);
                            }}
                            onMouseLeave={() => setHoveredJobId(null)}
                            className={`flex items-center gap-1.5 ${isHighMatch ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'} px-2.5 py-1 rounded-lg text-[10px] font-black transition-all border ${isHighMatch ? 'border-emerald-100' : 'border-amber-100'}`}
                          >
                            <Star className={`w-3 h-3 ${isHighMatch ? 'fill-emerald-500 text-emerald-500' : 'fill-amber-500 text-amber-500'}`} />
                            {percent}%
                          </div>

                          {hoveredJobId === job.id && (
                            <div className={cn(
                              "absolute right-0 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-[100] pointer-events-none animate-in fade-in zoom-in-95 duration-200 ring-1 ring-slate-200/50",
                              tooltipUp ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top"
                            )}>
                              <div className="space-y-3">
                                <div>
                                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Matched</div>
                                  <div className="flex flex-wrap gap-1">
                                    {matched.map(skill => (
                                      <span key={skill} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-bold border border-emerald-100">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">Missing</div>
                                  <div className="flex flex-wrap gap-1">
                                    {missing.map(skill => (
                                      <span key={skill} className="px-1.5 py-0.5 bg-red-50 text-red-700 rounded text-[9px] font-bold border border-red-100">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    <button
                      disabled={appliedJobIds.includes(job.id) || applyingJobId === job.id}
                      onClick={() => handleApply(job.id)}
                      className={cn(
                        "font-bold py-1.5 px-4 rounded-lg text-xs transition-all flex items-center justify-center gap-2 active:scale-95",
                        appliedJobIds.includes(job.id)
                          ? "bg-emerald-500 text-white border-emerald-500 cursor-default"
                          : applyingJobId === job.id
                            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-wait"
                            : "bg-white border border-slate-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-slate-700 shadow-sm"
                      )}
                    >
                      {appliedJobIds.includes(job.id) ? (
                        <>Applied <CheckCircle2 className="w-3.5 h-3.5" /></>
                      ) : applyingJobId === job.id ? (
                        <span className="w-3.5 h-3.5 border-2 border-slate-300 border-t-indigo-500 rounded-full animate-spin" />
                      ) : (
                        <>Apply <ExternalLink className="w-3.5 h-3.5" /></>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
          )}
        </div>
      </div>
    </div>
  );
}
