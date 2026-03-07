import { useState, type ReactNode } from 'react';
import type { TestConfig, Role, Language, Difficulty } from '../../types/aptitude';
import { Code2, Server, Layers, BarChart2, Terminal, ChevronRight, Cpu } from 'lucide-react';

interface TestSetupProps {
    onStart: (config: TestConfig) => void;
}

const ROLES: { id: Role; label: string; icon: ReactNode; description: string }[] = [
    { id: 'frontend', label: 'Frontend Dev', icon: <Code2 className="w-5 h-5" />, description: 'HTML, CSS, JS, React' },
    { id: 'backend', label: 'Backend Dev', icon: <Server className="w-5 h-5" />, description: 'APIs, Databases, Node' },
    { id: 'fullstack', label: 'Full Stack', icon: <Layers className="w-5 h-5" />, description: 'End-to-end development' },
    { id: 'data', label: 'Data Analyst', icon: <BarChart2 className="w-5 h-5" />, description: 'SQL, Python, Analytics' },
    { id: 'devops', label: 'DevOps', icon: <Terminal className="w-5 h-5" />, description: 'CI/CD, Cloud, Infra' },
    { id: 'general', label: 'General', icon: <Cpu className="w-5 h-5" />, description: 'Aptitude & Reasoning' },
];

const LANGUAGES: { id: Language; label: string; emoji: string }[] = [
    { id: 'javascript', label: 'JavaScript', emoji: '🟨' },
    { id: 'python', label: 'Python', emoji: '🐍' },
    { id: 'react', label: 'React', emoji: '⚛️' },
    { id: 'nodejs', label: 'Node.js', emoji: '🟢' },
    { id: 'java', label: 'Java', emoji: '☕' },
    { id: 'cpp', label: 'C++', emoji: '⚙️' },
    { id: 'general', label: 'No Preference', emoji: '🌐' },
];

const DIFFICULTIES: { id: Difficulty; label: string; ringColor: string; textColor: string; bgColor: string; desc: string }[] = [
    { id: 'easy', label: 'Easy', ringColor: 'ring-emerald-400', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50', desc: 'Fundamentals & basics' },
    { id: 'medium', label: 'Medium', ringColor: 'ring-amber-400', textColor: 'text-amber-700', bgColor: 'bg-amber-50', desc: 'Industry level questions' },
    { id: 'hard', label: 'Hard', ringColor: 'ring-rose-400', textColor: 'text-rose-700', bgColor: 'bg-rose-50', desc: 'Senior / FAANG level' },
];

const QUESTION_COUNTS = [5, 10, 15, 20];

export function TestSetup({ onStart }: TestSetupProps) {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [selectedLang, setSelectedLang] = useState<Language>('general');
    const [selectedDiff, setSelectedDiff] = useState<Difficulty>('medium');
    const [questionCount, setQuestionCount] = useState(10);

    const handleStart = () => {
        if (!selectedRole) return;
        onStart({ role: selectedRole, language: selectedLang, difficulty: selectedDiff, questionCount });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Aptitude Test</h1>
                <p className="text-slate-500 mt-1">Configure your test and assess your interview readiness.</p>
            </div>

            {/* Role Selection */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
                    1. Select Your Role <span className="text-rose-500">*</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {ROLES.map((r) => (
                        <button
                            key={r.id}
                            onClick={() => setSelectedRole(r.id)}
                            className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150 ${selectedRole === r.id
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                }`}
                        >
                            <div className={`mt-0.5 flex-shrink-0 ${selectedRole === r.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                                {r.icon}
                            </div>
                            <div>
                                <div className={`text-sm font-semibold ${selectedRole === r.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                                    {r.label}
                                </div>
                                <div className="text-xs text-slate-400 mt-0.5">{r.description}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Language Selection */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
                    2. Programming Language
                </h2>
                <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((l) => (
                        <button
                            key={l.id}
                            onClick={() => setSelectedLang(l.id)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full border-2 text-sm font-medium transition-all duration-150 ${selectedLang === l.id
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                        >
                            <span>{l.emoji}</span>
                            <span>{l.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Difficulty & Question Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Difficulty */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">3. Difficulty</h2>
                    <div className="space-y-2">
                        {DIFFICULTIES.map((d) => (
                            <button
                                key={d.id}
                                onClick={() => setSelectedDiff(d.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-150 ${selectedDiff === d.id
                                    ? `ring-2 ring-offset-1 ${d.ringColor} ${d.bgColor} border-transparent`
                                    : 'border-slate-200 hover:border-slate-300'
                                    }`}
                            >
                                <div>
                                    <span className={`font-semibold text-sm ${selectedDiff === d.id ? d.textColor : 'text-slate-700'}`}>
                                        {d.label}
                                    </span>
                                    <p className="text-xs text-slate-400 mt-0.5">{d.desc}</p>
                                </div>
                                {selectedDiff === d.id && (
                                    <div className={`w-3 h-3 rounded-full ${d.textColor.replace('text-', 'bg-')}`} />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Question Count */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">4. Questions</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {QUESTION_COUNTS.map((n) => (
                            <button
                                key={n}
                                onClick={() => setQuestionCount(n)}
                                className={`flex flex-col items-center justify-center py-5 rounded-xl border-2 transition-all duration-150 ${questionCount === n
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-slate-200 hover:border-indigo-300'
                                    }`}
                            >
                                <span className={`text-2xl font-bold ${questionCount === n ? 'text-indigo-600' : 'text-slate-700'}`}>
                                    {n}
                                </span>
                                <span className="text-xs text-slate-400 mt-0.5">~{n * 2} mins</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Start Button */}
            {!selectedRole && (
                <p className="text-center text-sm text-slate-400">Please select a role to start the test.</p>
            )}
            <button
                onClick={handleStart}
                disabled={!selectedRole}
                className="w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white shadow-lg shadow-indigo-200"
            >
                Start Test
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
}
