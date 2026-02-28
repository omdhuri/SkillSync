import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { TrendingUp, MapPin, Briefcase, Filter } from 'lucide-react';

const SALARY_DATA = [
  { role: 'Frontend Dev', min: 70000, median: 95000, max: 130000 },
  { role: 'Backend Dev', min: 75000, median: 105000, max: 140000 },
  { role: 'Full Stack', min: 80000, median: 110000, max: 150000 },
  { role: 'Data Scientist', min: 85000, median: 115000, max: 160000 },
  { role: 'DevOps', min: 90000, median: 120000, max: 165000 },
];

const TREND_DATA = [
  { year: '2020', salary: 85000 },
  { year: '2021', salary: 92000 },
  { year: '2022', salary: 105000 },
  { year: '2023', salary: 108000 },
  { year: '2024', salary: 110000 },
];

const SKILL_PREMIUMS = [
  { skill: 'React', premium: '+8%' },
  { skill: 'AWS', premium: '+12%' },
  { skill: 'Python', premium: '+10%' },
  { skill: 'TypeScript', premium: '+15%' },
  { skill: 'GraphQL', premium: '+7%' },
];

export function SalaryBenchmarking() {
  const [role, setRole] = useState('Full Stack Developer');
  const [location, setLocation] = useState('San Francisco, CA');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Live Salary Benchmarking</h1>
          <p className="text-slate-500 mt-1">Real-world data to help you negotiate confidently.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none"
            >
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Full Stack Developer</option>
              <option>Data Scientist</option>
            </select>
          </div>
          <div className="relative">
            <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none"
            >
              <option>San Francisco, CA</option>
              <option>New York, NY</option>
              <option>Austin, TX</option>
              <option>Remote (US)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-1">Median Base Salary</div>
          <div className="text-3xl font-bold text-slate-900">$110,000</div>
          <div className="mt-2 flex items-center text-sm font-medium text-emerald-600">
            <TrendingUp className="w-4 h-4 mr-1" />
            +4.2% from last year
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-1">Total Compensation (Avg)</div>
          <div className="text-3xl font-bold text-slate-900">$135,500</div>
          <div className="mt-2 text-sm text-slate-500">
            Includes bonus & equity
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-1">Market Demand</div>
          <div className="text-3xl font-bold text-indigo-600">Very High</div>
          <div className="mt-2 text-sm text-slate-500">
            Based on 1,240 active listings
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-base font-semibold text-slate-900 mb-6">Salary Distribution by Role</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SALARY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="role" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Salary']}
                />
                <Bar dataKey="median" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Panels */}
        <div className="space-y-6">
          {/* Skill Premiums */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Skill Premiums</h3>
            <p className="text-sm text-slate-500 mb-4">How specific skills impact your market value.</p>
            <div className="space-y-3">
              {SKILL_PREMIUMS.map((item) => (
                <div key={item.skill} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{item.skill}</span>
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{item.premium}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trend Chart */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">5-Year Trend</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TREND_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Median Salary']}
                  />
                  <Line type="monotone" dataKey="salary" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
