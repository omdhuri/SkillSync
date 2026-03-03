import React, { useState } from 'react';
import {
  FileText, Download, Wand2, Plus, Trash2,
  CheckCircle2, Sparkles, Loader2, User, Briefcase,
  GraduationCap, Code2, Save, RotateCcw, Award, FolderOpen, Star
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ClassicResumePDF, AcademicResumePDF, ModernResumePDF } from './ResumeBuilderPDF';
import { getData, setData, KEYS } from '../lib/storage';
import { enhanceResumeBullets, generateProfessionalSummary } from '../lib/gemini';
import type { ResumeData, ResumeProject, ResumeCertification, SkillCategories } from '../lib/types';

// ─── Rich sample template (shown on first load) ────────────────────────────────
const SAMPLE_DATA: ResumeData = {
  personal: {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexjohnson',
    github: 'github.com/alexjohnson',
    portfolio: 'alexjohnson.dev',
  },
  summary:
    'Results-driven Full Stack Developer with 3+ years of experience building scalable web applications. Proficient in React, Node.js, and AWS with a proven track record of delivering high-quality software that improves user experience and drives business outcomes.',
  experience: [
    {
      id: 1,
      company: 'TechCorp Solutions',
      role: 'Senior Frontend Developer',
      date: 'Jun 2022 – Present',
      bullets: [
        'Architected migration of legacy jQuery codebase to React 18, reducing bundle size by 45% and improving TTI by 800ms.',
        'Spearheaded development of a real-time analytics dashboard serving 50K+ daily active users using WebSockets and Recharts.',
        'Mentored 3 junior developers through weekly code reviews, improving team velocity by 30%.',
        'Collaborated with product and design to implement a new design system reducing UI inconsistencies by 80%.',
      ],
    },
    {
      id: 2,
      company: 'StartupXYZ',
      role: 'Full Stack Developer',
      date: 'Aug 2021 – May 2022',
      bullets: [
        'Built RESTful APIs with Node.js and Express, integrating PostgreSQL and Redis for 3× faster data retrieval.',
        'Implemented CI/CD pipelines using GitHub Actions, reducing deployment time from 2 hours to 15 minutes.',
        'Developed responsive, mobile-first interfaces using React and Tailwind CSS for 10,000+ users.',
      ],
    },
  ],
  education: [
    {
      id: 1,
      school: 'University of California, Berkeley',
      degree: 'B.Tech. Computer Science & Engineering',
      date: 'Aug 2017 – May 2021',
      gpa: '8.7 / 10.0',
    },
  ],
  projects: [
    {
      id: 1,
      name: 'DevFlow — AI Code Review Tool',
      description: 'Open-source VS Code extension for automated code review using OpenAI API. 2,000+ installs on the marketplace.',
      tech: 'TypeScript, VS Code API, OpenAI, Node.js',
      link: 'github.com/alex/devflow',
      date: 'Jan 2023',
    },
    {
      id: 2,
      name: 'QuickCart — E-Commerce Platform',
      description: 'Full-stack e-commerce app with real-time inventory, Stripe payments, and an admin dashboard.',
      tech: 'React, Node.js, PostgreSQL, Stripe, Docker',
      link: 'quickcart.alexjohnson.dev',
      date: 'Sep 2022',
    },
  ],
  certifications: [
    { id: 1, name: 'AWS Certified Developer – Associate', issuer: 'Amazon Web Services', date: 'Mar 2023' },
    { id: 2, name: 'Google Professional Cloud Developer', issuer: 'Google Cloud', date: 'Nov 2022' },
  ],
  achievements: [
    'Winner – HackBerkeley 2023 (500+ participants): built an AI-powered accessibility tool in 24 hours.',
    'Top 1% contributor on Stack Overflow — 2,500+ reputation with 150+ answers in React & TypeScript.',
  ],
  skills: 'React, TypeScript, JavaScript, Node.js, Python, PostgreSQL, MongoDB, Redis, AWS, Docker, Git, GraphQL, Tailwind CSS, Next.js',
  skillCategories: {
    languages: 'React, TypeScript, JavaScript, Python, Node.js',
    frameworks: 'React.js, Next.js, Express.js, Tailwind CSS',
    cloudDevops: 'AWS (EC2, S3, Lambda), Docker, GitHub Actions, CI/CD',
    databases: 'PostgreSQL, MongoDB, Redis, MySQL',
    tools: 'Git, JIRA, Figma, Postman, REST APIs, Agile/Scrum',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildDefaultData(): ResumeData {
  const profile = getData(KEYS.USER_PROFILE, null as any);
  if (!profile) return SAMPLE_DATA;
  return {
    ...SAMPLE_DATA,
    personal: {
      ...SAMPLE_DATA.personal,
      name: profile.name ?? SAMPLE_DATA.personal.name,
      email: profile.email ?? SAMPLE_DATA.personal.email,
      phone: profile.phone ?? SAMPLE_DATA.personal.phone,
      location: profile.location ?? SAMPLE_DATA.personal.location,
      linkedin: profile.linkedin ?? SAMPLE_DATA.personal.linkedin,
      github: profile.github ?? SAMPLE_DATA.personal.github,
      portfolio: profile.portfolio ?? SAMPLE_DATA.personal.portfolio,
    },
    skills: profile.skills?.join(', ') ?? SAMPLE_DATA.skills,
  };
}

function nextId(items: { id: number }[]) {
  return items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
}

type EnhanceState = 'idle' | 'loading' | 'done' | 'error';

// ─────────────────────────────────────────────────────────────────────────────
// PDF GENERATOR
// Uses @page { margin: 0 } + body padding to suppress browser URL headers/footers.
// All links are real <a href> anchors → clickable in the exported PDF.
// ─────────────────────────────────────────────────────────────────────────────
function generatePrintHTML(data: ResumeData): string {
  const esc = (s?: string) =>
    (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const link = (href: string, label: string) =>
    `<a href="${esc(href)}" style="color:#1a56db;text-decoration:none;">${esc(label)}</a>`;

  const contactParts: string[] = [];
  if (data.personal.email)
    contactParts.push(link(`mailto:${data.personal.email}`, data.personal.email));
  if (data.personal.phone)
    contactParts.push(link(`tel:${data.personal.phone}`, data.personal.phone));
  if (data.personal.location) contactParts.push(esc(data.personal.location));

  const linkParts: string[] = [];
  if (data.personal.linkedin)
    linkParts.push(link(`https://${data.personal.linkedin.replace(/^https?:\/\//, '')}`, data.personal.linkedin));
  if (data.personal.github)
    linkParts.push(link(`https://${data.personal.github.replace(/^https?:\/\//, '')}`, data.personal.github));
  if (data.personal.portfolio)
    linkParts.push(link(`https://${data.personal.portfolio.replace(/^https?:\/\//, '')}`, data.personal.portfolio));

  const experienceHTML = data.experience
    .filter((e) => e.company || e.role)
    .map(
      (exp) => `
      <div class="item">
        <div class="row-between"><span class="bold">${esc(exp.company)}</span><span class="date">${esc(exp.date)}</span></div>
        <div class="italic muted">${esc(exp.role)}</div>
        <ul>${exp.bullets.filter((b) => b.trim()).map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
      </div>`
    ).join('');

  const educationHTML = data.education
    .filter((e) => e.school || e.degree)
    .map(
      (edu) => `
      <div class="item">
        <div class="row-between"><span class="bold">${esc(edu.school)}</span><span class="date">${esc(edu.date)}</span></div>
        <div class="row-between"><span class="italic muted">${esc(edu.degree)}</span>${edu.gpa ? `<span>CGPA: ${esc(edu.gpa)}</span>` : ''}</div>
      </div>`
    ).join('');

  const projectsHTML = data.projects.filter((p) => p.name).map((p) => `
      <div class="item">
        <div class="row-between">
          <span class="bold">${esc(p.name)}${p.link ? ` &nbsp;<span class="small-link">${link('https://' + p.link.replace(/^https?:\/\//, ''), p.link)}</span>` : ''}</span>
          <span class="date">${esc(p.date ?? '')}</span>
        </div>
        ${p.description ? `<div class="muted">${esc(p.description)}</div>` : ''}
        ${p.tech ? `<div class="tech">Tech: ${esc(p.tech)}</div>` : ''}
      </div>`).join('');

  const certsHTML = data.certifications.filter((c) => c.name).map((c) => `
      <div class="item cert-row">
        <span><span class="bold">${esc(c.name)}</span> &mdash; ${esc(c.issuer)}</span>
        <span class="date">${esc(c.date)}</span>
      </div>`).join('');

  const achievementsHTML = data.achievements.filter((a) => a.trim())
    .map((a) => `<li>${esc(a)}</li>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title></title>
  <style>
    /* @page margin:0 suppresses browser-added URL header and date/time footer */
    @page { size: A4 portrait; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    html, body { width: 210mm; background: white; }
    body { font-family: 'Times New Roman', Georgia, serif; font-size: 11px; color: #111; line-height: 1.5; font-variant: normal; }

    /* Actual page content with padding (replaces @page margin) */
    .page { padding: 12mm 14mm; min-height: 297mm; }

    .name { font-size: 21px; font-weight: bold; text-align: center; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 4px; }
    .contact { text-align: center; color: #444; font-size: 10.5px; font-variant: normal; margin-bottom: 1px; }
    .sep { margin: 0 5px; color: #999; }
    .divider { border: none; border-top: 2px solid #111; margin: 6px 0 4px; }
    .section-title { font-size: 9.5px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid #444; padding-bottom: 2px; margin: 9px 0 4px; }
    .item { margin-bottom: 5px; }
    .row-between { display: flex; justify-content: space-between; align-items: baseline; }
    .bold { font-weight: bold; }
    .italic { font-style: italic; }
    .muted { color: #333; }
    .date { font-size: 9.5px; color: #555; white-space: nowrap; }
    .small-link { font-size: 9px; font-weight: normal; }
    .tech { font-size: 9.5px; color: #555; margin-top: 1px; }
    .cert-row { display: flex; justify-content: space-between; }
    ul { padding-left: 16px; margin-top: 2px; }
    li { margin-bottom: 1px; }

    /* Print instructions — hidden when actually printing */
    .print-tip { background: #fffbeb; border: 1px solid #f59e0b; padding: 8px 12px; margin-bottom: 12px; border-radius: 6px; font-family: Arial, sans-serif; font-size: 11px; color: #92400e; font-style: normal; }
    @media print { .print-tip { display: none !important; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="print-tip">
      💡 <strong>For a clean PDF (no header/footer):</strong> In the print dialog → <strong>More settings</strong> → uncheck <strong>Headers and footers</strong> → click <strong>Save</strong>.
    </div>

    <div class="name">${esc(data.personal.name)}</div>
    <div class="contact">${contactParts.join('<span class="sep">•</span>')}</div>
    ${linkParts.length ? `<div class="contact">${linkParts.join('<span class="sep">•</span>')}</div>` : ''}
    <hr class="divider" />

    ${data.summary ? `<div class="section-title">Professional Summary</div><p style="color:#222;margin-bottom:4px;">${esc(data.summary)}</p>` : ''}

    ${data.experience.filter((e) => e.company || e.role).length > 0 ? `<div class="section-title">Experience</div>${experienceHTML}` : ''}

    ${data.education.filter((e) => e.school).length > 0 ? `<div class="section-title">Education</div>${educationHTML}` : ''}

    ${data.projects.filter((p) => p.name).length > 0 ? `<div class="section-title">Projects</div>${projectsHTML}` : ''}

    ${data.certifications.filter((c) => c.name).length > 0 ? `<div class="section-title">Certifications</div>${certsHTML}` : ''}

    ${achievementsHTML ? `<div class="section-title">Achievements</div><ul>${achievementsHTML}</ul>` : ''}

    ${data.skills ? `<div class="section-title">Technical Skills</div><p style="color:#222;">${esc(data.skills)}</p>` : ''}
  </div>
  <script>
    window.onload = function() {
      document.title = '';   // clears browser header filename
      setTimeout(function() { window.print(); }, 300);
    };
  </script>
</body>
</html>`;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function ResumeBuilder() {
  const [data, setResumeData] = useState<ResumeData>(() => {
    const defaults = buildDefaultData();
    const stored = getData<Partial<ResumeData>>(KEYS.RESUME_DATA, {});
    if (!stored || Object.keys(stored).length === 0) return defaults;
    return {
      ...defaults,
      ...stored,
      personal: { ...defaults.personal, ...(stored.personal ?? {}) },
      summary: stored.summary ?? defaults.summary,
      experience: stored.experience ?? defaults.experience,
      education: stored.education ?? defaults.education,
      projects: stored.projects ?? [],
      certifications: stored.certifications ?? [],
      achievements: stored.achievements ?? [],
      skills: stored.skills ?? defaults.skills,
    };
  });

  const [saved, setSaved] = useState(false);
  const [template, setTemplate] = useState<'classic' | 'academic' | 'modern'>('classic');
  const [enhanceState, setEnhanceState] = useState<Record<number, EnhanceState>>({});
  const [globalEnhancing, setGlobalEnhancing] = useState(false);
  const [summaryGenerating, setSummaryGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ── Persistence ──
  const handleSave = () => {
    setData(KEYS.RESUME_DATA, data);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  const handleReset = () => setResumeData(buildDefaultData());

  // ── PDF export — one-click, clean, via @react-pdf/renderer ──
  // Rendered as PDFDownloadLink in JSX below (no popup needed)

  // ── Skill Categories (Academic template) ──
  const setSkillCat = (field: keyof SkillCategories, val: string | null) =>
    setResumeData((d) => ({
      ...d,
      skillCategories: val === null
        ? { ...d.skillCategories, [field]: undefined }
        : { ...d.skillCategories, [field]: val },
    }));

  // ── Personal ──
  const setPersonal = (field: keyof ResumeData['personal'], value: string) =>
    setResumeData((d) => ({ ...d, personal: { ...d.personal, [field]: value } }));

  // ── Experience ──
  const addExperience = () =>
    setResumeData((d) => ({ ...d, experience: [...d.experience, { id: nextId(d.experience), company: '', role: '', date: '', bullets: [''] }] }));
  const removeExperience = (id: number) =>
    setResumeData((d) => ({ ...d, experience: d.experience.filter((e) => e.id !== id) }));
  const setExpField = (id: number, field: 'company' | 'role' | 'date' | 'technologiesUsed', val: string) =>
    setResumeData((d) => ({ ...d, experience: d.experience.map((e) => e.id === id ? { ...e, [field]: val } : e) }));
  const setBullet = (expId: number, bIdx: number, val: string) =>
    setResumeData((d) => ({ ...d, experience: d.experience.map((e) => e.id === expId ? { ...e, bullets: e.bullets.map((b, i) => i === bIdx ? val : b) } : e) }));
  const addBullet = (expId: number) =>
    setResumeData((d) => ({ ...d, experience: d.experience.map((e) => e.id === expId ? { ...e, bullets: [...e.bullets, ''] } : e) }));
  const removeBullet = (expId: number, bIdx: number) =>
    setResumeData((d) => ({ ...d, experience: d.experience.map((e) => e.id === expId ? { ...e, bullets: e.bullets.filter((_, i) => i !== bIdx) } : e) }));

  // ── Education ──
  const addEducation = () =>
    setResumeData((d) => ({ ...d, education: [...d.education, { id: nextId(d.education), school: '', degree: '', date: '', gpa: '' }] }));
  const removeEducation = (id: number) =>
    setResumeData((d) => ({ ...d, education: d.education.filter((e) => e.id !== id) }));
  const setEduField = (id: number, field: 'school' | 'degree' | 'date' | 'gpa' | 'coursework', val: string) =>
    setResumeData((d) => ({ ...d, education: d.education.map((e) => e.id === id ? { ...e, [field]: val } : e) }));

  // ── Projects ──
  const addProject = () =>
    setResumeData((d) => ({ ...d, projects: [...d.projects, { id: nextId(d.projects), name: '', description: '', tech: '', link: '', date: '' }] }));
  const removeProject = (id: number) =>
    setResumeData((d) => ({ ...d, projects: d.projects.filter((p) => p.id !== id) }));
  const setProjectField = (id: number, field: keyof ResumeProject, val: string) =>
    setResumeData((d) => ({ ...d, projects: d.projects.map((p) => p.id === id ? { ...p, [field]: val } : p) }));

  // ── Certifications ──
  const addCertification = () =>
    setResumeData((d) => ({ ...d, certifications: [...d.certifications, { id: nextId(d.certifications), name: '', issuer: '', date: '' }] }));
  const removeCertification = (id: number) =>
    setResumeData((d) => ({ ...d, certifications: d.certifications.filter((c) => c.id !== id) }));
  const setCertField = (id: number, field: keyof ResumeCertification, val: string) =>
    setResumeData((d) => ({ ...d, certifications: d.certifications.map((c) => c.id === id ? { ...c, [field]: val } : c) }));

  // ── Achievements ──
  const addAchievement = () =>
    setResumeData((d) => ({ ...d, achievements: [...d.achievements, ''] }));
  const setAchievement = (idx: number, val: string) =>
    setResumeData((d) => ({ ...d, achievements: d.achievements.map((a, i) => i === idx ? val : a) }));
  const removeAchievement = (idx: number) =>
    setResumeData((d) => ({ ...d, achievements: d.achievements.filter((_, i) => i !== idx) }));

  // ── AI: Summary ──
  const handleGenerateSummary = async () => {
    setSummaryGenerating(true);
    setErrorMsg(null);
    try {
      const profile = getData(KEYS.USER_PROFILE, null as any);
      const skills = (profile?.skills ?? data.skills.split(',').map((s: string) => s.trim()));
      const role = profile?.targetRole ?? data.experience[0]?.role ?? 'Software Engineer';
      const summary = await generateProfessionalSummary(role, skills, '2+');
      setResumeData((d) => ({ ...d, summary }));
    } catch { setErrorMsg('Could not generate summary. Check your API key.'); }
    finally { setSummaryGenerating(false); }
  };

  // ── AI: Enhance one experience ──
  const handleEnhanceOne = async (expId: number) => {
    const exp = data.experience.find((e) => e.id === expId);
    if (!exp) return;
    const nonEmpty = exp.bullets.filter((b) => b.trim());
    if (!nonEmpty.length) { setErrorMsg('Add at least one bullet before enhancing.'); setTimeout(() => setErrorMsg(null), 3000); return; }
    setEnhanceState((s) => ({ ...s, [expId]: 'loading' }));
    setErrorMsg(null);
    try {
      const enhanced = await enhanceResumeBullets(nonEmpty);
      let ei = 0;
      setResumeData((d) => ({ ...d, experience: d.experience.map((e) => e.id === expId ? { ...e, bullets: e.bullets.map((b) => b.trim() ? (enhanced[ei++] ?? b) : b) } : e) }));
      setEnhanceState((s) => ({ ...s, [expId]: 'done' }));
      setTimeout(() => setEnhanceState((s) => ({ ...s, [expId]: 'idle' })), 3000);
    } catch {
      setEnhanceState((s) => ({ ...s, [expId]: 'error' }));
      setErrorMsg('AI enhancement failed. Check your API key.');
      setTimeout(() => { setEnhanceState((s) => ({ ...s, [expId]: 'idle' })); setErrorMsg(null); }, 4000);
    }
  };

  // ── AI: Enhance all ──
  const handleEnhanceAll = async () => {
    setGlobalEnhancing(true); setErrorMsg(null);
    try {
      const allBullets = data.experience.flatMap((e) => e.bullets.filter((b) => b.trim()));
      if (!allBullets.length) { setErrorMsg('No bullet points to enhance.'); setGlobalEnhancing(false); return; }
      const enhanced = await enhanceResumeBullets(allBullets);
      let ei = 0;
      setResumeData((d) => ({ ...d, experience: d.experience.map((exp) => ({ ...exp, bullets: exp.bullets.map((b) => b.trim() ? (enhanced[ei++] ?? b) : b) })) }));
    } catch { setErrorMsg('Global enhancement failed. Try again.'); }
    finally { setGlobalEnhancing(false); }
  };

  const inp = 'w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors';
  const lbl = 'block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest';

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" /> AI Resume Builder
          </h1>
          <p className="text-slate-500 mt-0.5 text-sm">Build, edit, and AI-enhance your ATS-optimized resume.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {errorMsg && <span className="text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-lg">{errorMsg}</span>}
          {saved && <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg"><CheckCircle2 className="w-3.5 h-3.5" /> Saved</span>}
          <button onClick={handleReset} className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:border-slate-300 px-3 py-2 rounded-lg transition-colors"><RotateCcw className="w-4 h-4" /> Reset</button>
          <button onClick={handleSave} className="flex items-center gap-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 px-3 py-2 rounded-lg transition-colors"><Save className="w-4 h-4" /> Save</button>
          <button onClick={handleEnhanceAll} disabled={globalEnhancing} className="flex items-center gap-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-2 rounded-lg transition-colors disabled:opacity-60">
            {globalEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {globalEnhancing ? 'Enhancing…' : 'Enhance All with AI'}
          </button>
          <PDFDownloadLink
            document={
              template === 'academic' ? <AcademicResumePDF data={data} /> :
                template === 'modern' ? <ModernResumePDF data={data} /> :
                  <ClassicResumePDF data={data} />
            }
            fileName={`${(data.personal.name || 'resume').replace(/\s+/g, '_')}-Resume.pdf`}
            className="flex items-center gap-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-lg shadow-sm transition-colors"
          >
            {({ loading }) => <><Download className="w-4 h-4" />{loading ? 'Preparing…' : 'Export PDF'}</>}
          </PDFDownloadLink>
        </div>
      </div>

      {/* ── Two Pane ── */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-0 overflow-hidden">

        {/* ══ EDITOR ══ */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-y-auto">
          <div className="p-6 space-y-8">

            {/* Personal Info */}
            <Section icon={<User className="w-4 h-4 text-indigo-500" />} title="Personal Info">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1"><label className={lbl}>Full Name</label><input type="text" value={data.personal.name} onChange={(e) => setPersonal('name', e.target.value)} className={inp} /></div>
                <div className="col-span-2 sm:col-span-1"><label className={lbl}>Email</label><input type="email" value={data.personal.email} onChange={(e) => setPersonal('email', e.target.value)} className={inp} /></div>
                <div><label className={lbl}>Phone</label><input type="tel" value={data.personal.phone} onChange={(e) => setPersonal('phone', e.target.value)} className={inp} /></div>
                <div><label className={lbl}>Location</label><input type="text" value={data.personal.location} onChange={(e) => setPersonal('location', e.target.value)} className={inp} /></div>
                <div><label className={lbl}>LinkedIn URL</label><input type="text" value={data.personal.linkedin} onChange={(e) => setPersonal('linkedin', e.target.value)} className={inp} placeholder="linkedin.com/in/yourname" /></div>
                <div><label className={lbl}>GitHub URL</label><input type="text" value={data.personal.github ?? ''} onChange={(e) => setPersonal('github', e.target.value)} className={inp} placeholder="github.com/yourusername" /></div>
                <div className="col-span-2 sm:col-span-1"><label className={lbl}>Portfolio URL</label><input type="text" value={data.personal.portfolio} onChange={(e) => setPersonal('portfolio', e.target.value)} className={inp} placeholder="yourportfolio.dev" /></div>
              </div>
            </Section>

            <Divider />

            {/* Summary */}
            <Section
              icon={<Star className="w-4 h-4 text-indigo-500" />}
              title="Professional Summary"
              action={
                <button onClick={handleGenerateSummary} disabled={summaryGenerating} className="flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-md disabled:opacity-60 transition-colors">
                  {summaryGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                  {summaryGenerating ? 'Generating…' : 'Generate with AI'}
                </button>
              }
            >
              <textarea rows={3} value={data.summary} onChange={(e) => setResumeData((d) => ({ ...d, summary: e.target.value }))} placeholder="A results-driven engineer… or click Generate with AI" className={`${inp} resize-none`} />
            </Section>

            <Divider />

            {/* Experience */}
            <Section
              icon={<Briefcase className="w-4 h-4 text-indigo-500" />}
              title="Work Experience"
              action={<button onClick={addExperience} className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"><Plus className="w-3.5 h-3.5" /> Add Role</button>}
            >
              <div className="space-y-5">
                {data.experience.map((exp) => {
                  const st = enhanceState[exp.id] ?? 'idle';
                  return (
                    <div key={exp.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 relative group">
                      <button onClick={() => removeExperience(exp.id)} className="absolute top-3 right-3 p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded"><Trash2 className="w-4 h-4" /></button>
                      <div className="grid grid-cols-2 gap-3 mb-3 pr-8">
                        <div><label className={lbl}>Company</label><input type="text" value={exp.company} onChange={(e) => setExpField(exp.id, 'company', e.target.value)} className={inp} placeholder="Company name" /></div>
                        <div><label className={lbl}>Job Title</label><input type="text" value={exp.role} onChange={(e) => setExpField(exp.id, 'role', e.target.value)} className={inp} placeholder="e.g. Frontend Developer" /></div>
                        <div className="col-span-2"><label className={lbl}>Dates</label><input type="text" value={exp.date} onChange={(e) => setExpField(exp.id, 'date', e.target.value)} className={inp} placeholder="e.g. Jan 2022 – Present" /></div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <label className={lbl}>Accomplishments</label>
                        <button onClick={() => handleEnhanceOne(exp.id)} disabled={st === 'loading'} className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md transition-all disabled:opacity-60 ${st === 'done' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : st === 'error' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100'}`}>
                          {st === 'loading' ? <Loader2 className="w-3 h-3 animate-spin" /> : st === 'done' ? <CheckCircle2 className="w-3 h-3" /> : <Wand2 className="w-3 h-3" />}
                          {st === 'loading' ? 'Enhancing…' : st === 'done' ? 'Enhanced!' : st === 'error' ? 'Failed' : 'Enhance with AI'}
                        </button>
                      </div>
                      <div className="space-y-2">
                        {exp.bullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-2">
                            <span className="text-slate-400 mt-2.5 text-xs select-none">•</span>
                            <textarea value={bullet} onChange={(e) => setBullet(exp.id, bIdx, e.target.value)} rows={2} placeholder="Describe your accomplishment with impact…" className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none transition-colors" />
                            <button onClick={() => removeBullet(exp.id, bIdx)} className="mt-2 p-1 text-slate-300 hover:text-rose-500 transition-colors rounded flex-shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => addBullet(exp.id)} className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"><Plus className="w-3 h-3" /> Add Bullet</button>
                      {template === 'academic' && (
                        <div className="mt-3">
                          <label className={lbl}>Technologies Used <span className="font-normal text-slate-400">(optional)</span></label>
                          <input type="text" value={exp.technologiesUsed ?? ''} onChange={(e) => setExpField(exp.id, 'technologiesUsed', e.target.value)} className={inp} placeholder="e.g. React, Node.js, PostgreSQL, AWS" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Section>

            <Divider />

            {/* Education */}
            <Section
              icon={<GraduationCap className="w-4 h-4 text-indigo-500" />}
              title="Education"
              action={<button onClick={addEducation} className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"><Plus className="w-3.5 h-3.5" /> Add</button>}
            >
              <div className="space-y-4">
                {data.education.map((edu) => (
                  <div key={edu.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 relative group">
                    <button onClick={() => removeEducation(edu.id)} className="absolute top-3 right-3 p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid grid-cols-2 gap-3 pr-8">
                      <div className="col-span-2"><label className={lbl}>School / University</label><input type="text" value={edu.school} onChange={(e) => setEduField(edu.id, 'school', e.target.value)} className={inp} placeholder="e.g. MIT" /></div>
                      <div><label className={lbl}>Degree</label><input type="text" value={edu.degree} onChange={(e) => setEduField(edu.id, 'degree', e.target.value)} className={inp} placeholder="e.g. B.Tech. Computer Science" /></div>
                      <div><label className={lbl}>CGPA (optional)</label><input type="text" value={edu.gpa} onChange={(e) => setEduField(edu.id, 'gpa', e.target.value)} className={inp} placeholder="e.g. 8.7 / 10.0" /></div>
                      <div className="col-span-2"><label className={lbl}>Dates</label><input type="text" value={edu.date} onChange={(e) => setEduField(edu.id, 'date', e.target.value)} className={inp} placeholder="e.g. Aug 2018 – May 2022" /></div>
                      {template === 'academic' && (
                        <div className="col-span-2">
                          <div className="flex items-center justify-between">
                            <label className={lbl}>Relevant Coursework <span className="font-normal text-slate-400">(optional)</span></label>
                            {edu.coursework !== undefined
                              ? <button onClick={() => setEduField(edu.id, 'coursework', '')} className="text-xs text-rose-400 hover:text-rose-600">Remove</button>
                              : <button onClick={() => setEduField(edu.id, 'coursework', '')} className="text-xs text-indigo-500 hover:text-indigo-700">+ Add</button>
                            }
                          </div>
                          {edu.coursework !== undefined && <input type="text" value={edu.coursework} onChange={(e) => setEduField(edu.id, 'coursework', e.target.value)} className={inp} placeholder="e.g. Data Structures, Algorithms, DBMS" />}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Divider />

            {/* Projects */}
            <Section
              icon={<FolderOpen className="w-4 h-4 text-indigo-500" />}
              title="Projects"
              action={<button onClick={addProject} className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"><Plus className="w-3.5 h-3.5" /> Add Project</button>}
            >
              {data.projects.length === 0
                ? <EmptySlot label="Add a project" onClick={addProject} />
                : <div className="space-y-4">
                  {data.projects.map((proj) => (
                    <div key={proj.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 relative group">
                      <button onClick={() => removeProject(proj.id)} className="absolute top-3 right-3 p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded"><Trash2 className="w-4 h-4" /></button>
                      <div className="grid grid-cols-2 gap-3 pr-8">
                        <div><label className={lbl}>Project Name</label><input type="text" value={proj.name} onChange={(e) => setProjectField(proj.id, 'name', e.target.value)} className={inp} placeholder="e.g. My Awesome App" /></div>
                        <div><label className={lbl}>Date (optional)</label><input type="text" value={proj.date ?? ''} onChange={(e) => setProjectField(proj.id, 'date', e.target.value)} className={inp} placeholder="e.g. Mar 2024" /></div>
                        <div className="col-span-2"><label className={lbl}>Description</label><textarea rows={2} value={proj.description} onChange={(e) => setProjectField(proj.id, 'description', e.target.value)} className={`${inp} resize-none`} placeholder="What it does and your role in it…" /></div>
                        <div><label className={lbl}>Tech Stack</label><input type="text" value={proj.tech} onChange={(e) => setProjectField(proj.id, 'tech', e.target.value)} className={inp} placeholder="React, Node.js, PostgreSQL" /></div>
                        <div><label className={lbl}>Link (optional)</label><input type="text" value={proj.link ?? ''} onChange={(e) => setProjectField(proj.id, 'link', e.target.value)} className={inp} placeholder="github.com/you/project" /></div>
                      </div>
                    </div>
                  ))}
                </div>
              }
            </Section>

            <Divider />

            {/* Certifications */}
            <Section
              icon={<Award className="w-4 h-4 text-indigo-500" />}
              title="Certifications"
              action={<button onClick={addCertification} className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"><Plus className="w-3.5 h-3.5" /> Add</button>}
            >
              {data.certifications.length === 0
                ? <EmptySlot label="Add a certification" onClick={addCertification} />
                : <div className="space-y-3">
                  {data.certifications.map((cert) => (
                    <div key={cert.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 relative group">
                      <button onClick={() => removeCertification(cert.id)} className="absolute top-3 right-3 p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all rounded"><Trash2 className="w-4 h-4" /></button>
                      <div className="grid grid-cols-2 gap-3 pr-8">
                        <div className="col-span-2"><label className={lbl}>Certification Name</label><input type="text" value={cert.name} onChange={(e) => setCertField(cert.id, 'name', e.target.value)} className={inp} placeholder="e.g. AWS Certified Solutions Architect" /></div>
                        <div><label className={lbl}>Issuing Organization</label><input type="text" value={cert.issuer} onChange={(e) => setCertField(cert.id, 'issuer', e.target.value)} className={inp} placeholder="e.g. Amazon Web Services" /></div>
                        <div><label className={lbl}>Date</label><input type="text" value={cert.date} onChange={(e) => setCertField(cert.id, 'date', e.target.value)} className={inp} placeholder="e.g. June 2023" /></div>
                      </div>
                    </div>
                  ))}
                </div>
              }
            </Section>

            <Divider />

            {/* Achievements */}
            <Section
              icon={<Star className="w-4 h-4 text-amber-500" />}
              title="Achievements"
              action={<button onClick={addAchievement} className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"><Plus className="w-3.5 h-3.5" /> Add</button>}
            >
              {data.achievements.length === 0
                ? <EmptySlot label="Add an achievement" onClick={addAchievement} />
                : <div className="space-y-2">
                  {data.achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-slate-400 text-sm select-none">🏆</span>
                      <input type="text" value={ach} onChange={(e) => setAchievement(idx, e.target.value)} className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors" placeholder="e.g. Winner – National Hackathon 2023" />
                      <button onClick={() => removeAchievement(idx)} className="p-1 text-slate-300 hover:text-rose-500 transition-colors rounded flex-shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                  <button onClick={addAchievement} className="mt-1 flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-indigo-600"><Plus className="w-3 h-3" /> Add Another</button>
                </div>
              }
            </Section>

            <Divider />

            {/* Skills — Academic shows categorized, others show flat list */}
            <Section icon={<Code2 className="w-4 h-4 text-indigo-500" />} title="Technical Skills">
              {template === 'academic' ? (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400">Each category is optional. Click remove to hide it from your resume.</p>
                  {([
                    { key: 'languages' as const, label: 'Languages', ph: 'Java, Python, JavaScript, TypeScript…' },
                    { key: 'frameworks' as const, label: 'Frameworks', ph: 'Spring Boot, React.js, Node.js, Django…' },
                    { key: 'cloudDevops' as const, label: 'Cloud & DevOps', ph: 'AWS, Docker, Kubernetes, CI/CD…' },
                    { key: 'databases' as const, label: 'Databases', ph: 'MySQL, MongoDB, PostgreSQL, Redis…' },
                    { key: 'tools' as const, label: 'Tools & Others', ph: 'Git, JIRA, REST APIs, Agile/Scrum…' },
                  ]).map(({ key, label, ph }) => {
                    const val = data.skillCategories?.[key];
                    const isHidden = val === undefined;
                    return (
                      <div key={key}>
                        <div className="flex items-center justify-between mb-1">
                          <label className={lbl}>{label}</label>
                          {isHidden
                            ? <button onClick={() => setSkillCat(key, '')} className="text-xs text-indigo-500 hover:text-indigo-700">+ Add</button>
                            : <button onClick={() => setSkillCat(key, null)} className="text-xs text-rose-400 hover:text-rose-600">Remove</button>
                          }
                        </div>
                        {!isHidden && <input type="text" value={val ?? ''} onChange={(e) => setSkillCat(key, e.target.value)} className={inp} placeholder={ph} />}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-400 mb-2">Comma-separated list of your skills.</p>
                  <textarea value={data.skills} onChange={(e) => setResumeData((d) => ({ ...d, skills: e.target.value }))} rows={3} placeholder="React, TypeScript, Node.js, Python…" className={`${inp} resize-none`} />
                </>
              )}
            </Section>
          </div>
        </div>

        {/* ══ PREVIEW ══ */}
        <div className="bg-slate-100 rounded-2xl overflow-hidden flex flex-col items-center py-6 px-4 xl:overflow-y-auto shadow-inner relative">
          {/* Template Switcher */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-4 shadow-sm flex-shrink-0">
            {(['classic', 'academic', 'modern'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTemplate(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${template === t
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
              >
                {t === 'classic' ? '📄 Classic' : t === 'academic' ? '🎓 Academic' : '🚀 Modern'}
              </button>
            ))}
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm z-10">
            <CheckCircle2 className="w-3 h-3" /> ATS Optimized
          </div>
          <div className="w-full" style={{ maxWidth: '210mm' }}>
            {template === 'classic' && <ResumePreview data={data} />}
            {template === 'academic' && <AcademicResumePreview data={data} />}
            {template === 'modern' && <ModernResumePreview data={data} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Resume Preview ───────────────────────────────────────────────────────────
function ResumePreview({ data }: { data: ResumeData }) {
  const contactRow = [data.personal.email, data.personal.phone, data.personal.location].filter(Boolean);
  const linkRow = [data.personal.linkedin, data.personal.github, data.personal.portfolio].filter(Boolean);

  return (
    <div className="bg-white shadow-2xl font-serif text-slate-900 overflow-hidden" style={{ width: '100%', aspectRatio: '1 / 1.414', padding: '10mm 12mm', fontSize: '10.5px', lineHeight: '1.5', boxSizing: 'border-box', fontVariant: 'normal' }}>
      {/* Header */}
      <div className="text-center border-b-2 border-slate-900 pb-3 mb-3">
        <h1 className="font-bold tracking-widest uppercase mb-1" style={{ fontSize: '20px', letterSpacing: '0.12em' }}>{data.personal.name || 'Your Name'}</h1>
        {/* Contact — explicitly normal font-variant to avoid small-caps on phone */}
        <div className="text-slate-600 flex flex-wrap items-center justify-center gap-x-1.5" style={{ fontVariant: 'normal', fontVariantCaps: 'normal' }}>
          {contactRow.map((v, i) => (
            <React.Fragment key={i}>
              <span>{v}</span>{i < contactRow.length - 1 && <span className="text-slate-300">•</span>}
            </React.Fragment>
          ))}
        </div>
        {linkRow.length > 0 && (
          <div className="text-blue-600 underline flex flex-wrap items-center justify-center gap-x-1.5 mt-0.5" style={{ fontVariant: 'normal' }}>
            {linkRow.map((v, i) => (
              <React.Fragment key={i}>
                <span className="cursor-pointer">{v}</span>{i < linkRow.length - 1 && <span className="text-slate-300">•</span>}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {data.summary && <PreviewSection title="Professional Summary"><p className="text-slate-700">{data.summary}</p></PreviewSection>}

      {/* Experience */}
      {data.experience.filter((e) => e.company || e.role).length > 0 && (
        <PreviewSection title="Experience">
          {data.experience.map((exp) => (
            <div key={exp.id} className="mb-2">
              <div className="flex justify-between items-baseline"><span className="font-bold">{exp.company || 'Company'}</span><span className="text-slate-500" style={{ fontSize: '9.5px' }}>{exp.date}</span></div>
              <div className="italic text-slate-700 mb-0.5">{exp.role}</div>
              <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-slate-700">{exp.bullets.filter((b) => b.trim()).map((b, i) => <li key={i} className="pl-0.5">{b}</li>)}</ul>
            </div>
          ))}
        </PreviewSection>
      )}

      {/* Education */}
      {data.education.filter((e) => e.school).length > 0 && (
        <PreviewSection title="Education">
          {data.education.map((edu) => (
            <div key={edu.id} className="mb-1.5">
              <div className="flex justify-between items-baseline"><span className="font-bold">{edu.school || 'University'}</span><span className="text-slate-500" style={{ fontSize: '9.5px' }}>{edu.date}</span></div>
              <div className="flex justify-between items-baseline text-slate-700"><span className="italic">{edu.degree}</span>{edu.gpa && <span>CGPA: {edu.gpa}</span>}</div>
            </div>
          ))}
        </PreviewSection>
      )}

      {/* Projects */}
      {data.projects.filter((p) => p.name).length > 0 && (
        <PreviewSection title="Projects">
          {data.projects.filter((p) => p.name).map((proj) => (
            <div key={proj.id} className="mb-1.5">
              <div className="flex justify-between items-baseline">
                <span className="font-bold">{proj.name}{proj.link && <span className="font-normal text-blue-600 underline ml-1.5" style={{ fontSize: '9px' }}>{proj.link}</span>}</span>
                <span className="text-slate-500" style={{ fontSize: '9.5px' }}>{proj.date}</span>
              </div>
              {proj.description && <div className="text-slate-700">{proj.description}</div>}
              {proj.tech && <div className="text-slate-500" style={{ fontSize: '9.5px' }}>Tech: {proj.tech}</div>}
            </div>
          ))}
        </PreviewSection>
      )}

      {/* Certifications */}
      {data.certifications.filter((c) => c.name).length > 0 && (
        <PreviewSection title="Certifications">
          {data.certifications.filter((c) => c.name).map((cert) => (
            <div key={cert.id} className="flex justify-between items-baseline mb-0.5">
              <span><span className="font-bold">{cert.name}</span> — {cert.issuer}</span>
              <span className="text-slate-500" style={{ fontSize: '9.5px' }}>{cert.date}</span>
            </div>
          ))}
        </PreviewSection>
      )}

      {/* Achievements */}
      {data.achievements.filter((a) => a.trim()).length > 0 && (
        <PreviewSection title="Achievements">
          <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-slate-700">
            {data.achievements.filter((a) => a.trim()).map((a, i) => <li key={i} className="pl-0.5">{a}</li>)}
          </ul>
        </PreviewSection>
      )}

      {/* Skills */}
      {data.skills && <PreviewSection title="Technical Skills"><p className="text-slate-700">{data.skills}</p></PreviewSection>}
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function PreviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-2.5">
      <h2 className="font-bold uppercase border-b border-slate-400 pb-0.5 mb-1.5 text-slate-800" style={{ fontSize: '9.5px', letterSpacing: '0.1em' }}>{title}</h2>
      {children}
    </div>
  );
}

function EmptySlot({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full py-5 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors flex flex-col items-center gap-1">
      <Plus className="w-4 h-4" /> {label}
    </button>
  );
}

function Divider() { return <hr className="border-slate-100" />; }

function Section({ icon, title, action, children }: { icon: React.ReactNode; title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">{icon}{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 2 — ACADEMIC (Single-column, serif font, categorized skills)
// ═══════════════════════════════════════════════════════════════════════════════
// Mirrors the FIRST_LASTNAME template from user's image.
// ═══════════════════════════════════════════════════════════════════════════════
function AcademicResumePreview({ data }: { data: ResumeData }) {
  const sc = data.skillCategories;
  const contacts = [data.personal.phone, data.personal.email, data.personal.location].filter(Boolean).join('  |  ');
  const linkParts = [data.personal.linkedin && 'LinkedIn', data.personal.github && 'GitHub', data.personal.portfolio && 'Portfolio'].filter(Boolean).join('  |  ');
  const contactLine = [contacts, linkParts].filter(Boolean).join('  |  ');

  const base: React.CSSProperties = { fontFamily: "'Times New Roman', Georgia, serif", fontSize: '9.5px', lineHeight: '1.45', color: '#111', fontVariant: 'normal' };
  const secTitle: React.CSSProperties = { fontWeight: 'bold', fontSize: '10.5px', marginTop: '8px', marginBottom: '3px', borderBottom: '0.8px solid #333', paddingBottom: '1px' };
  const row: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' };

  return (
    <div style={{ ...base, width: '100%', aspectRatio: '1 / 1.414', padding: '8mm 10mm', boxSizing: 'border-box', background: 'white', overflow: 'hidden' }}>
      {/* Header — centered */}
      <div style={{ textAlign: 'center', marginBottom: '5px' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{data.personal.name || 'YOUR NAME'}</div>
        <div style={{ fontSize: '8.5px', color: '#333', marginTop: '2px' }}>{contactLine}</div>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid #000', marginBottom: '5px' }} />

      {/* Professional Summary */}
      {data.summary && <>
        <div style={secTitle}>Professional Summary</div>
        <p style={{ color: '#222', fontSize: '9px', marginBottom: '2px' }}>{data.summary}</p>
      </>}

      {/* Technical Skills — categorized */}
      {(sc?.languages || sc?.frameworks || sc?.cloudDevops || sc?.databases || sc?.tools) && <>
        <div style={secTitle}>Technical Skills</div>
        <div style={{ fontSize: '9px' }}>
          {sc.languages && <div style={{ marginBottom: '1px' }}><span style={{ fontWeight: 'bold' }}>Languages: </span>{sc.languages}</div>}
          {sc.frameworks && <div style={{ marginBottom: '1px' }}><span style={{ fontWeight: 'bold' }}>Frameworks: </span>{sc.frameworks}</div>}
          {sc.cloudDevops && <div style={{ marginBottom: '1px' }}><span style={{ fontWeight: 'bold' }}>Cloud &amp; DevOps: </span>{sc.cloudDevops}</div>}
          {sc.databases && <div style={{ marginBottom: '1px' }}><span style={{ fontWeight: 'bold' }}>Databases: </span>{sc.databases}</div>}
          {sc.tools && <div><span style={{ fontWeight: 'bold' }}>Tools &amp; Others: </span>{sc.tools}</div>}
        </div>
      </>}
      {!sc && data.skills && <>
        <div style={secTitle}>Technical Skills</div>
        <p style={{ fontSize: '9px' }}>{data.skills}</p>
      </>}

      {/* Professional Experience */}
      {data.experience.filter(e => e.company).length > 0 && <>
        <div style={secTitle}>Professional Experience</div>
        {data.experience.filter(e => e.company).map(exp => (
          <div key={exp.id} style={{ marginBottom: '5px' }}>
            <div style={row}>
              <span style={{ fontWeight: 'bold', fontSize: '9.5px' }}>{exp.role || '[Job Role]'}</span>
              <span style={{ fontSize: '8.5px', color: '#555' }}>{exp.date}</span>
            </div>
            <div style={{ fontStyle: 'italic', fontSize: '9px', color: '#444', marginBottom: '1px' }}>{exp.company}</div>
            <ul style={{ paddingLeft: '14px', margin: '1px 0', fontSize: '9px' }}>
              {exp.bullets.filter(b => b.trim()).map((b, i) => <li key={i} style={{ marginBottom: '1px' }}>{b}</li>)}
            </ul>
            {exp.technologiesUsed && <div style={{ fontSize: '8.5px', color: '#555', marginTop: '1px' }}>Technologies used: {exp.technologiesUsed}</div>}
          </div>
        ))}
      </>}

      {/* Projects */}
      {data.projects.filter(p => p.name).length > 0 && <>
        <div style={secTitle}>Projects</div>
        {data.projects.filter(p => p.name).map(proj => (
          <div key={proj.id} style={{ marginBottom: '4px' }}>
            <div style={row}>
              <span style={{ fontWeight: 'bold', fontSize: '9.5px' }}>{proj.name}</span>
              <span style={{ fontSize: '8.5px', color: '#555' }}>{proj.date}</span>
            </div>
            {proj.description && <div style={{ fontSize: '9px' }}>{proj.description}</div>}
            {proj.tech && <div style={{ fontSize: '8.5px', color: '#555' }}>Tech: {proj.tech}</div>}
          </div>
        ))}
      </>}

      {/* Education */}
      {data.education.filter(e => e.school).length > 0 && <>
        <div style={secTitle}>Education</div>
        {data.education.filter(e => e.school).map(edu => (
          <div key={edu.id} style={{ marginBottom: '4px' }}>
            <div style={row}>
              <span style={{ fontWeight: 'bold', fontSize: '9.5px' }}>{edu.degree}</span>
              <span style={{ fontSize: '8.5px', color: '#555' }}>{edu.date}</span>
            </div>
            <div style={{ fontSize: '9px', fontStyle: 'italic', color: '#444' }}>
              {edu.school}{edu.gpa ? `  CGPA: ${edu.gpa}` : ''}
            </div>
            {edu.coursework && <div style={{ fontSize: '8.5px', color: '#444' }}>Relevant Coursework: {edu.coursework}</div>}
          </div>
        ))}
      </>}

      {/* Certifications */}
      {data.certifications.filter(c => c.name).length > 0 && <>
        <div style={secTitle}>Certifications</div>
        <ul style={{ paddingLeft: '14px', fontSize: '9px', margin: '2px 0' }}>
          {data.certifications.filter(c => c.name).map(cert => (
            <li key={cert.id} style={{ marginBottom: '1px' }}>
              <span style={{ fontWeight: 'bold' }}>{cert.name}</span> from {cert.issuer} ({cert.date})
            </li>
          ))}
        </ul>
      </>}

      {/* Additional Information */}
      {data.achievements.filter(a => a.trim()).length > 0 && <>
        <div style={secTitle}>Additional Information</div>
        <ul style={{ paddingLeft: '14px', fontSize: '9px', margin: '2px 0' }}>
          {data.achievements.filter(a => a.trim()).map((a, i) => <li key={i} style={{ marginBottom: '1px' }}>{a}</li>)}
        </ul>
      </>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE 3 — MODERN (Two-column: experience left, skills/edu/other right)
// Mirrors the Sachin Kumar Shukla template from user's image.
// ═══════════════════════════════════════════════════════════════════════════════
function ModernResumePreview({ data }: { data: ResumeData }) {
  const role = data.experience[0]?.role ?? '';
  const allLinks = [data.personal.email && { label: 'Email', url: `mailto:${data.personal.email}` }, data.personal.phone && { label: data.personal.phone, url: `tel:${data.personal.phone}` }, data.personal.github && { label: 'Github', url: `https://${data.personal.github.replace(/^https?:\/\//, '')}` }, data.personal.portfolio && { label: 'ProductHunt', url: `https://${data.personal.portfolio.replace(/^https?:\/\//, '')}` }].filter(Boolean) as { label: string; url: string }[];
  const base: React.CSSProperties = { fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '8.5px', lineHeight: '1.4', color: '#111', fontVariant: 'normal' };
  const secStyle: React.CSSProperties = { fontSize: '9px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1.5px solid #000', paddingBottom: '2px', marginBottom: '4px', marginTop: '8px' };

  return (
    <div style={{ ...base, width: '100%', aspectRatio: '1 / 1.414', padding: '7mm 8mm', boxSizing: 'border-box', background: 'white', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ marginBottom: '5px', borderBottom: '2px solid #000', paddingBottom: '5px' }}>
        <div style={{ fontSize: '19px', fontWeight: '900', fontFamily: 'Georgia, serif', letterSpacing: '-0.01em' }}>{data.personal.name || 'Your Name'}</div>
        {role && <div style={{ fontSize: '9px', color: '#333', fontWeight: '600', marginTop: '1px' }}>{role}{data.personal.location ? ` | ${data.personal.location}` : ''}</div>}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '2px' }}>
          {allLinks.map((lnk, i) => (
            <span key={i} style={{ color: '#1a56db', fontSize: '8.5px', textDecoration: 'underline', cursor: 'pointer' }}>{lnk.label}</span>
          ))}
        </div>
      </div>

      {/* Two columns */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {/* LEFT — Experience + Projects */}
        <div style={{ flex: '0 0 58%', minWidth: 0 }}>
          {data.experience.filter(e => e.company).length > 0 && <>
            <div style={secStyle}>Experience</div>
            {data.experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '6px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '9px' }}>{exp.company} | {exp.role}</div>
                <div style={{ fontSize: '8px', color: '#666', marginBottom: '2px' }}>{exp.date}</div>
                <ul style={{ paddingLeft: '12px', margin: 0 }}>
                  {exp.bullets.filter(b => b.trim()).map((b, i) => <li key={i} style={{ marginBottom: '1px', fontSize: '8px' }}>{b}</li>)}
                </ul>
              </div>
            ))}
          </>}

          {data.projects.filter(p => p.name).length > 0 && <>
            <div style={secStyle}>Projects</div>
            {data.projects.filter(p => p.name).map(proj => (
              <div key={proj.id} style={{ marginBottom: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '9px' }}>{proj.name}</span>
                  <span style={{ fontSize: '8px', color: '#666' }}>{proj.date}</span>
                </div>
                {proj.link && <div style={{ fontSize: '8px', color: '#1a56db', textDecoration: 'underline' }}>{proj.link}</div>}
                {proj.description && <div style={{ fontSize: '8px', color: '#333' }}>{proj.description}</div>}
                {proj.tech && <div style={{ fontSize: '8px', color: '#555', marginTop: '1px' }}>Tech: {proj.tech}</div>}
              </div>
            ))}
          </>}
        </div>

        {/* RIGHT — Skills, Education, Certs, Achievements */}
        <div style={{ flex: '0 0 42%', minWidth: 0, borderLeft: '1px solid #ddd', paddingLeft: '8px' }}>
          {data.skills && <>
            <div style={{ ...secStyle, marginTop: 0 }}>Skills</div>
            <div style={{ fontSize: '8px', color: '#333' }}>{data.skills}</div>
          </>}

          {data.education.filter(e => e.school).length > 0 && <>
            <div style={secStyle}>Education</div>
            {data.education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '4px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '9px' }}>{edu.school}</div>
                <div style={{ fontSize: '8px', fontStyle: 'italic' }}>{edu.degree}</div>
                <div style={{ fontSize: '8px', color: '#555' }}>{edu.date}{edu.gpa ? ` · CGPA: ${edu.gpa}` : ''}</div>
              </div>
            ))}
          </>}

          {data.certifications.filter(c => c.name).length > 0 && <>
            <div style={secStyle}>Certifications</div>
            {data.certifications.filter(c => c.name).map(cert => (
              <div key={cert.id} style={{ marginBottom: '3px' }}>
                <div style={{ fontWeight: 'bold', fontSize: '8.5px' }}>{cert.name}</div>
                <div style={{ fontSize: '8px', color: '#555' }}>{cert.issuer} · {cert.date}</div>
              </div>
            ))}
          </>}

          {data.achievements.filter(a => a.trim()).length > 0 && <>
            <div style={secStyle}>Achievements</div>
            <ul style={{ paddingLeft: '12px', margin: 0 }}>
              {data.achievements.filter(a => a.trim()).map((a, i) => <li key={i} style={{ marginBottom: '2px', fontSize: '8px' }}>{a}</li>)}
            </ul>
          </>}
        </div>
      </div>
    </div>
  );
}

function generateModernHTML(data: ResumeData): string {
  const esc = (s?: string) => (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const role = data.experience[0]?.role ?? '';
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title></title><style>
    @page{size:A4 portrait;margin:0;}
    *{box-sizing:border-box;margin:0;padding:0;}
    html,body{width:210mm;background:white;font-family:Arial,Helvetica,sans-serif;font-size:8.5px;color:#111;line-height:1.4;font-variant:normal;}
    .page{padding:7mm 8mm;min-height:297mm;}
    .name{font-size:19px;font-weight:900;font-family:Georgia,serif;letter-spacing:-.01em;}
    .role{font-size:9px;color:#333;font-weight:600;margin-top:1px;}
    .links{display:flex;gap:6px;flex-wrap:wrap;margin-top:2px;}
    .link{color:#1a56db;font-size:8.5px;text-decoration:underline;}
    .header{border-bottom:2px solid #000;padding-bottom:5px;margin-bottom:5px;}
    .cols{display:flex;gap:8px;}
    .left{flex:0 0 58%;min-width:0;}
    .right{flex:0 0 42%;min-width:0;border-left:1px solid #ddd;padding-left:8px;}
    .sec{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;border-bottom:1.5px solid #000;padding-bottom:2px;margin-bottom:4px;margin-top:8px;}
    .sec-first{margin-top:0;}
    .exp-head{font-weight:bold;font-size:9px;}
    .exp-date{font-size:8px;color:#666;margin-bottom:2px;}
    ul{padding-left:12px;margin:0;}
    li{margin-bottom:1px;font-size:8px;}
    .proj-name{font-weight:bold;font-size:9px;}
    .print-tip{background:#fffbeb;border:1px solid #f59e0b;padding:5px 8px;margin-bottom:8px;border-radius:4px;font-size:9px;color:#92400e;}
    @media print{.print-tip{display:none!important;}}
  </style></head><body><div class="page">
    <div class="print-tip">💡 <strong>Clean PDF:</strong> Print dialog → More settings → uncheck Headers and footers → Save.</div>
    <div class="header">
      <div class="name">${esc(data.personal.name)}</div>
      ${role ? `<div class="role">${esc(role)}${data.personal.location ? ` | ${esc(data.personal.location)}` : ''}</div>` : ''}
      <div class="links">${[data.personal.email && `<a href="mailto:${esc(data.personal.email)}" class="link">Email</a>`, data.personal.phone && `<a href="tel:${esc(data.personal.phone)}" class="link">${esc(data.personal.phone)}</a>`, data.personal.github && `<a href="https://${data.personal.github.replace(/^https?:\/\//, '')}" class="link">GitHub</a>`, data.personal.portfolio && `<a href="https://${data.personal.portfolio.replace(/^https?:\/\//, '')}" class="link">Portfolio</a>`].filter(Boolean).join('')}</div>
    </div>
    <div class="cols">
      <div class="left">
        ${data.experience.filter(e => e.company).length ? `<div class="sec">Experience</div>${data.experience.filter(e => e.company).map(exp => `<div style="margin-bottom:6px;"><div class="exp-head">${esc(exp.company)} | ${esc(exp.role)}</div><div class="exp-date">${esc(exp.date)}</div><ul>${exp.bullets.filter(b => b.trim()).map(b => `<li>${esc(b)}</li>`).join('')}</ul></div>`).join('')}` : ''}
        ${data.projects.filter(p => p.name).length ? `<div class="sec">Projects</div>${data.projects.filter(p => p.name).map(p => `<div style="margin-bottom:5px;"><div style="display:flex;justify-content:space-between;"><span class="proj-name">${esc(p.name)}</span><span style="font-size:8px;color:#666;">${esc(p.date ?? '')}</span></div>${p.link ? `<div class="link" style="font-size:8px;">${esc(p.link)}</div>` : ''}${p.description ? `<div style="font-size:8px;color:#333;">${esc(p.description)}</div>` : ''}${p.tech ? `<div style="font-size:8px;color:#555;">Tech: ${esc(p.tech)}</div>` : ''}</div>`).join('')}` : ''}
      </div>
      <div class="right">
        ${data.skills ? `<div class="sec sec-first">Skills</div><div style="font-size:8px;color:#333;">${esc(data.skills)}</div>` : ''}
        ${data.education.filter(e => e.school).length ? `<div class="sec">Education</div>${data.education.filter(e => e.school).map(edu => `<div style="margin-bottom:4px;"><div style="font-weight:bold;font-size:9px;">${esc(edu.school)}</div><div style="font-size:8px;font-style:italic;">${esc(edu.degree)}</div><div style="font-size:8px;color:#555;">${esc(edu.date)}${edu.gpa ? ` · CGPA: ${esc(edu.gpa)}` : ''}</div></div>`).join('')}` : ''}
        ${data.certifications.filter(c => c.name).length ? `<div class="sec">Certifications</div>${data.certifications.filter(c => c.name).map(c => `<div style="margin-bottom:3px;"><div style="font-weight:bold;font-size:8.5px;">${esc(c.name)}</div><div style="font-size:8px;color:#555;">${esc(c.issuer)} · ${esc(c.date)}</div></div>`).join('')}` : ''}
        ${data.achievements.filter(a => a.trim()).length ? `<div class="sec">Achievements</div><ul>${data.achievements.filter(a => a.trim()).map(a => `<li>${esc(a)}</li>`).join('')}</ul>` : ''}
      </div>
    </div>
  </div><script>window.onload=function(){document.title='';setTimeout(function(){window.print();},300);};</script></body></html>`;
}
