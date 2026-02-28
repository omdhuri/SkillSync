import { useState } from 'react';
import { Briefcase, MapPin, DollarSign, Star, ExternalLink, Filter, Search } from 'lucide-react';

const JOBS = [
  {
    id: 1,
    title: 'Frontend Engineer',
    company: 'Stripe',
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    matchScore: 92,
    type: 'Full-time',
    posted: '2 days ago',
    logo: 'https://logo.clearbit.com/stripe.com',
    skills: ['React', 'TypeScript', 'CSS'],
  },
  {
    id: 2,
    title: 'React Developer',
    company: 'Vercel',
    location: 'Remote',
    salary: '$110k - $140k',
    matchScore: 88,
    type: 'Full-time',
    posted: '5 hours ago',
    logo: 'https://logo.clearbit.com/vercel.com',
    skills: ['Next.js', 'React', 'Tailwind'],
  },
  {
    id: 3,
    title: 'UI Engineer',
    company: 'Linear',
    location: 'Remote',
    salary: '$130k - $160k',
    matchScore: 85,
    type: 'Full-time',
    posted: '1 week ago',
    logo: 'https://logo.clearbit.com/linear.app',
    skills: ['React', 'TypeScript', 'GraphQL'],
  },
  {
    id: 4,
    title: 'Junior Web Developer',
    company: 'Shopify',
    location: 'Toronto, ON (Hybrid)',
    salary: '$80k - $100k',
    matchScore: 95,
    type: 'Full-time',
    posted: '1 day ago',
    logo: 'https://logo.clearbit.com/shopify.com',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
  },
];

export function JobSuggestions() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Job Suggestions</h1>
          <p className="text-slate-500 mt-1">High-signal opportunities matched to your Skill Graph.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search roles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-64"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Match Score</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                <span className="text-sm text-slate-700">90% + (High Match)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                <span className="text-sm text-slate-700">75% - 89% (Good Match)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-slate-700">Below 75% (Stretch)</span>
              </label>
            </div>

            <h3 className="text-sm font-semibold text-slate-900 mb-4 mt-6">Job Type</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                <span className="text-sm text-slate-700">Full-time</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-slate-700">Internship</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-slate-700">Contract</span>
              </label>
            </div>
          </div>
        </div>

        {/* Job Listings */}
        <div className="lg:col-span-3 space-y-4">
          {JOBS.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg border border-slate-100 overflow-hidden bg-white flex-shrink-0">
                    <img src={job.logo} alt={job.company} className="w-full h-full object-contain p-2" onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${job.company}&background=random`;
                    }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h3>
                    <div className="text-sm text-slate-500 mt-1">{job.company}</div>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" /> {job.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" /> {job.type}
                      </span>
                      <span className="text-slate-400">• {job.posted}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      {job.skills.map(skill => (
                        <span key={skill} className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-between sm:h-full gap-4 sm:gap-0">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                      {job.matchScore}% Match
                    </div>
                  </div>
                  <button className="w-full sm:w-auto mt-auto bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 rounded-md text-sm transition-colors flex items-center justify-center gap-2">
                    Apply Now <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
