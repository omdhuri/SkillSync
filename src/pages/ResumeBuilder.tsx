import { useState } from 'react';
import { FileText, Download, Wand2, Plus, Trash2, GripVertical, CheckCircle2 } from 'lucide-react';

const INITIAL_DATA = {
  personal: {
    name: 'Felix Developer',
    email: 'felix@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/felixdev',
    portfolio: 'felix.dev'
  },
  experience: [
    {
      id: 1,
      company: 'Tech Startup Inc.',
      role: 'Frontend Developer',
      date: 'Jan 2022 - Present',
      bullets: [
        'Spearheaded the migration of a legacy dashboard to React and Next.js, improving load times by 40%.',
        'Collaborated with UX designers to implement a new design system using Tailwind CSS.',
        'Mentored 2 junior developers and conducted weekly code reviews.'
      ]
    }
  ],
  education: [
    {
      id: 1,
      school: 'University of Technology',
      degree: 'B.S. Computer Science',
      date: 'Aug 2018 - May 2022',
      gpa: '3.8/4.0'
    }
  ],
  skills: 'React, TypeScript, Next.js, Tailwind CSS, Node.js, GraphQL, Git, Agile'
};

export function ResumeBuilder() {
  const [data, setData] = useState(INITIAL_DATA);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      // Mock AI generation by adding a new bullet point
      const newData = { ...data };
      newData.experience[0].bullets.push('Optimized core web vitals resulting in a 15% increase in user retention.');
      setData(newData);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">AI Resume Builder</h1>
          <p className="text-slate-500 mt-1">Headless CMS-style builder forcing ATS-optimized output.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium py-2 px-4 rounded-md text-sm transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            Auto-Enhance with AI
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
        {/* Editor Pane */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-y-auto flex flex-col">
          <div className="p-6 space-y-8">
            
            {/* Personal Info */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <UserIcon className="w-4 h-4 text-indigo-500" /> Personal Info
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                  <input type="text" value={data.personal.name} onChange={(e) => setData({...data, personal: {...data.personal, name: e.target.value}})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                  <input type="email" value={data.personal.email} onChange={(e) => setData({...data, personal: {...data.personal, email: e.target.value}})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                  <input type="tel" value={data.personal.phone} onChange={(e) => setData({...data, personal: {...data.personal, phone: e.target.value}})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Location</label>
                  <input type="text" value={data.personal.location} onChange={(e) => setData({...data, personal: {...data.personal, location: e.target.value}})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Experience */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                  <BriefcaseIcon className="w-4 h-4 text-indigo-500" /> Experience
                </h3>
                <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Add Role
                </button>
              </div>
              
              <div className="space-y-6">
                {data.experience.map((exp, idx) => (
                  <div key={exp.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative group">
                    <button className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Company</label>
                        <input type="text" value={exp.company} onChange={() => {}} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Role</label>
                        <input type="text" value={exp.role} onChange={() => {}} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Dates</label>
                        <input type="text" value={exp.date} onChange={() => {}} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-2">Accomplishments</label>
                      <div className="space-y-2">
                        {exp.bullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2">
                            <GripVertical className="w-4 h-4 text-slate-400 mt-2 cursor-grab flex-shrink-0" />
                            <textarea 
                              value={bullet} 
                              onChange={() => {}} 
                              rows={2}
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none" 
                            />
                          </div>
                        ))}
                      </div>
                      <button className="mt-2 text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Bullet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* Skills */}
            <section>
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <CodeIcon className="w-4 h-4 text-indigo-500" /> Skills
              </h3>
              <div>
                <textarea 
                  value={data.skills} 
                  onChange={(e) => setData({...data, skills: e.target.value})} 
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none" 
                  placeholder="Comma separated skills..."
                />
              </div>
            </section>

          </div>
        </div>

        {/* Preview Pane */}
        <div className="bg-slate-200 rounded-xl overflow-hidden flex flex-col items-center justify-start p-8 relative shadow-inner">
          <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <CheckCircle2 className="w-3 h-3" /> ATS Optimized
          </div>
          
          {/* A4 Paper Mock */}
          <div className="w-full max-w-[210mm] aspect-[1/1.414] bg-white shadow-xl p-10 text-slate-900 font-serif text-[11px] leading-relaxed overflow-hidden">
            {/* Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 mb-4">
              <h1 className="text-2xl font-bold uppercase tracking-widest mb-1">{data.personal.name}</h1>
              <div className="flex items-center justify-center gap-3 text-slate-600">
                <span>{data.personal.email}</span>
                <span>•</span>
                <span>{data.personal.phone}</span>
                <span>•</span>
                <span>{data.personal.location}</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-slate-600 mt-1">
                <span>{data.personal.linkedin}</span>
                <span>•</span>
                <span>{data.personal.portfolio}</span>
              </div>
            </div>

            {/* Experience */}
            <div className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-slate-300 mb-2 pb-1 text-slate-800">Experience</h2>
              {data.experience.map(exp => (
                <div key={exp.id} className="mb-3">
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>{exp.company}</span>
                    <span className="text-slate-600 font-normal">{exp.date}</span>
                  </div>
                  <div className="italic text-slate-700 mb-1">{exp.role}</div>
                  <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx} className="pl-1">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-slate-300 mb-2 pb-1 text-slate-800">Education</h2>
              {data.education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline font-bold text-slate-900">
                    <span>{edu.school}</span>
                    <span className="text-slate-600 font-normal">{edu.date}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-slate-700">
                    <span className="italic">{edu.degree}</span>
                    <span>GPA: {edu.gpa}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider border-b border-slate-300 mb-2 pb-1 text-slate-800">Technical Skills</h2>
              <p className="text-slate-700 leading-relaxed">
                <span className="font-bold">Core:</span> {data.skills}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple icon wrappers to avoid importing too many things at top
function UserIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
function BriefcaseIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg> }
function CodeIcon(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> }
