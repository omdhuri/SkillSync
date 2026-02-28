import { useState } from 'react';
import { PlayCircle, Clock, Star, ExternalLink, CheckCircle2 } from 'lucide-react';

const COURSES = [
  {
    id: 1,
    title: 'React - The Complete Guide (incl Hooks, React Router, Redux)',
    provider: 'Udemy',
    author: 'Maximilian Schwarzmüller',
    duration: '48.5 hours',
    rating: 4.7,
    students: '750k+',
    level: 'Beginner to Advanced',
    skills: ['React', 'Hooks', 'Redux'],
    match: 'High Priority',
    status: 'enrolled',
    progress: 35
  },
  {
    id: 2,
    title: 'Fullstack React with Next.js',
    provider: 'YouTube',
    author: 'Fireship',
    duration: '2.5 hours',
    rating: 4.9,
    students: '1.2M views',
    level: 'Intermediate',
    skills: ['Next.js', 'React', 'Tailwind'],
    match: 'Recommended',
    status: 'not_started'
  },
  {
    id: 3,
    title: 'Advanced CSS and Sass: Flexbox, Grid, Animations',
    provider: 'Coursera',
    author: 'Jonas Schmedtmann',
    duration: '28 hours',
    rating: 4.8,
    students: '300k+',
    level: 'Advanced',
    skills: ['CSS', 'Sass', 'Flexbox'],
    match: 'Skill Gap',
    status: 'not_started'
  },
  {
    id: 4,
    title: 'TypeScript for React Developers',
    provider: 'Frontend Masters',
    author: 'Frontend Masters',
    duration: '5 hours',
    rating: 4.9,
    students: '50k+',
    level: 'Intermediate',
    skills: ['TypeScript', 'React'],
    match: 'High Priority',
    status: 'completed'
  }
];

export function LearningPaths() {
  const [filter, setFilter] = useState('All');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Curated Learning Paths</h1>
          <p className="text-slate-500 mt-1">High-authority courses suggested to close your identified skill gaps.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          {['All', 'In Progress', 'Completed'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {COURSES.map(course => (
          <div key={course.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md hover:border-indigo-200 transition-all">
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  course.match === 'High Priority' ? 'bg-rose-50 text-rose-700' :
                  course.match === 'Recommended' ? 'bg-indigo-50 text-indigo-700' :
                  'bg-amber-50 text-amber-700'
                }`}>
                  {course.match}
                </span>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                  {course.provider}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-sm text-slate-500 mb-4">{course.author}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {course.rating}
                </span>
                <span>{course.level}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {course.skills.map(skill => (
                  <span key={skill} className="px-2 py-1 bg-slate-50 border border-slate-100 text-slate-600 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 mt-auto">
              {course.status === 'enrolled' ? (
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-2">
                    <span>In Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 mb-3">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                  <button className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-2 px-4 rounded-md text-sm transition-colors flex items-center justify-center gap-2">
                    <PlayCircle className="w-4 h-4" /> Continue Learning
                  </button>
                </div>
              ) : course.status === 'completed' ? (
                <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium text-sm py-2">
                  <CheckCircle2 className="w-5 h-5" /> Completed
                </div>
              ) : (
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors flex items-center justify-center gap-2">
                  Start Course <ExternalLink className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
