import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  CheckCircle2, AlertCircle, ExternalLink,
  Briefcase, MapPin, BookOpen, FileText, Target, Zap,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// ─── Readiness score computed from real profile data ────────────────────────
interface ReadinessItem {
  label: string;
  description: string;
  done: boolean;
  href: string;
  icon: React.ElementType;
  weight: number; // % contribution to total score
}

function useReadiness() {
  const { profile } = useAuth();

  const items: ReadinessItem[] = useMemo(() => [
    {
      label: 'Target role set',
      description: 'Tell us what role you are aiming for.',
      done: !!profile?.target_role,
      href: '/settings',
      icon: Target,
      weight: 25,
    },
    {
      label: 'Skills added',
      description: 'Add at least 5 skills to your profile.',
      done: (profile?.skills?.length ?? 0) >= 5,
      href: '/settings',
      icon: Zap,
      weight: 25,
    },
    {
      label: 'Resume saved',
      description: 'Build and save your resume to the cloud.',
      done: !!profile?.resume_data,
      href: '/resume-builder',
      icon: FileText,
      weight: 25,
    },
    {
      label: 'Profile complete',
      description: 'Add your location, bio, and contact info.',
      done: !!(profile?.location && profile?.bio),
      href: '/settings',
      icon: BookOpen,
      weight: 25,
    },
  ], [profile]);

  const score = items.reduce((sum, item) => sum + (item.done ? item.weight : 0), 0);
  return { items, score };
}

// ─── Platform deep-link cards ────────────────────────────────────────────────
interface Platform {
  name: string;
  tagline: string;
  bestFor: string;
  color: string;
  hoverColor: string;
  textColor: string;
  buildUrl: (role: string, location: string) => string;
}

const PLATFORMS: Platform[] = [
  {
    name: 'LinkedIn',
    tagline: 'Professional Network',
    bestFor: 'Mid–senior roles & networking',
    color: 'bg-[#0A66C2]',
    hoverColor: 'hover:bg-[#004182]',
    textColor: 'text-white',
    buildUrl: (role, loc) =>
      `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(role)}&location=${encodeURIComponent(loc)}`,
  },
  {
    name: 'Naukri',
    tagline: "India's #1 Job Board",
    bestFor: 'IT & tech roles across India',
    color: 'bg-[#FF7555]',
    hoverColor: 'hover:bg-[#e05a38]',
    textColor: 'text-white',
    buildUrl: (role, loc) =>
      `https://www.naukri.com/${encodeURIComponent(role.toLowerCase().replace(/\s+/g, '-'))}-jobs-in-${encodeURIComponent(loc.toLowerCase().replace(/\s+/g, '-'))}`,
  },
  {
    name: 'Internshala',
    tagline: 'Freshers & Interns',
    bestFor: 'Entry-level roles & internships',
    color: 'bg-[#00AAFF]',
    hoverColor: 'hover:bg-[#0088dd]',
    textColor: 'text-white',
    buildUrl: (role) =>
      `https://internshala.com/jobs/${encodeURIComponent(role.toLowerCase().replace(/\s+/g, '-'))}/`,
  },
  {
    name: 'Indeed',
    tagline: 'Global Job Search',
    bestFor: 'Startups, remote & global roles',
    color: 'bg-[#003A9B]',
    hoverColor: 'hover:bg-[#002878]',
    textColor: 'text-white',
    buildUrl: (role, loc) =>
      `https://in.indeed.com/jobs?q=${encodeURIComponent(role)}&l=${encodeURIComponent(loc)}`,
  },
];

// ─── Score ring color ─────────────────────────────────────────────────────────
function scoreColor(score: number) {
  if (score >= 75) return { ring: 'text-emerald-500', bg: 'bg-emerald-50', label: 'text-emerald-700', badge: 'Ready to Apply' };
  if (score >= 50) return { ring: 'text-amber-500', bg: 'bg-amber-50', label: 'text-amber-700', badge: 'Almost Ready' };
  return { ring: 'text-rose-400', bg: 'bg-rose-50', label: 'text-rose-600', badge: 'Prepare First' };
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function JobSuggestions() {
  const { profile } = useAuth();
  const { items, score } = useReadiness();
  const colors = scoreColor(score);

  const role = profile?.target_role || 'Software Developer';
  const location = profile?.location || 'India';

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-indigo-600" /> Job Suggestions
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Prepare on SkillSync, then apply on the right platform with one click.
        </p>
      </div>

      {/* ── Readiness Card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">

          {/* Score meter */}
          <div className="relative flex-shrink-0 w-28 h-28">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="10" />
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                className={colors.ring}
                strokeDasharray={`${score * 2.638} 263.8`}
                style={{ transition: 'stroke-dasharray 0.8s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-black ${colors.ring}`}>{score}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Ready</span>
            </div>
          </div>

          {/* Score summary */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors.bg} ${colors.label}`}>
                {colors.badge}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              {score < 100 ? (
                <>Complete your profile to unlock <span className="text-indigo-600">stronger job matches</span></>
              ) : (
                <>You're fully ready — <span className="text-emerald-600">start applying!</span></>
              )}
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Targeting <strong className="text-slate-700">{role}</strong> in <strong className="text-slate-700">{location}</strong>.
              {score < 100 && ' Finish the steps below to improve your score.'}
            </p>
          </div>
        </div>

        {/* Checklist */}
        <div className="border-t border-slate-100 divide-y divide-slate-50">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-4 px-6 py-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                <item.icon className={`w-4 h-4 ${item.done ? 'text-emerald-500' : 'text-slate-400'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${item.done ? 'text-slate-700 line-through decoration-slate-300' : 'text-slate-800'}`}>
                  {item.label}
                </p>
                {!item.done && (
                  <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                )}
              </div>
              {item.done
                ? <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                : (
                  <NavLink
                    to={item.href}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex-shrink-0 transition-colors"
                  >
                    Fix <ArrowRight className="w-3 h-3" />
                  </NavLink>
                )
              }
            </div>
          ))}
        </div>
      </div>

      {/* ── Platform Launcher ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Apply on Platforms</h2>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Pre-filled with your role & location
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PLATFORMS.map((p) => {
            const url = p.buildUrl(role, location);
            return (
              <a
                key={p.name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center justify-between p-5 rounded-2xl ${p.color} ${p.hoverColor} ${p.textColor} transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`}
              >
                <div>
                  <div className="text-base font-bold">{p.name}</div>
                  <div className="text-xs opacity-75 mt-0.5">{p.tagline}</div>
                  <div className="text-xs opacity-60 mt-2 bg-white/10 px-2 py-0.5 rounded-full inline-block">
                    {p.bestFor}
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-transform">
                  Search <ExternalLink className="w-4 h-4 ml-1" />
                </div>
              </a>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          Clicking any platform opens a live, pre-filled search using your target role and location.
        </p>
      </div>

      {/* ── Tip Banner ── */}
      {score < 75 && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-indigo-900">Tip from SkillSync</p>
            <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
              Candidates with complete profiles and saved resumes get <strong>3× more callbacks</strong>.
              Complete the checklist above before applying — your resume and skill data will make your application stand out.
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
