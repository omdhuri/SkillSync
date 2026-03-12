import { useState } from 'react';
import type { TestConfig, Difficulty } from '../../types/aptitude';
import { ChevronRight } from 'lucide-react';

interface TestSetupProps {
    onStart: (config: TestConfig) => void;
}

const DIFFICULTIES: { id: Difficulty; label: string; ringColor: string; textColor: string; bgColor: string; desc: string }[] = [
    { id: 'easy', label: 'Easy', ringColor: 'ring-emerald-400', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50', desc: 'Fundamentals & basics' },
    { id: 'medium', label: 'Medium', ringColor: 'ring-amber-400', textColor: 'text-amber-700', bgColor: 'bg-amber-50', desc: 'Industry level questions' },
    { id: 'hard', label: 'Hard', ringColor: 'ring-rose-400', textColor: 'text-rose-700', bgColor: 'bg-rose-50', desc: 'Advanced logic & reasoning' },
];

const QUESTION_COUNTS = [5, 10, 15, 20];

export function TestSetup({ onStart }: TestSetupProps) {
    const [selectedDiff, setSelectedDiff] = useState<Difficulty>('medium');
    const [questionCount, setQuestionCount] = useState(10);

    const handleStart = () => {
        onStart({
            role: 'general',    // Hardcoded for general aptitude
            language: 'general', // Hardcoded for general aptitude
            difficulty: selectedDiff,
            questionCount
        });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">General Aptitude Test</h1>
                <p className="text-slate-500 max-w-lg mx-auto">
                    Challenge your logic, quantitative, and verbal reasoning skills. Configure your test below to begin.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Difficulty */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-5 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs">1</span>
                        Select Difficulty
                    </h2>
                    <div className="space-y-3">
                        {DIFFICULTIES.map((d) => (
                            <button
                                key={d.id}
                                onClick={() => setSelectedDiff(d.id)}
                                className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${selectedDiff === d.id
                                    ? `ring-4 ring-offset-0 ${d.ringColor} ${d.bgColor} border-transparent`
                                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                                    }`}
                            >
                                <div className="text-left">
                                    <span className={`font-semibold text-base ${selectedDiff === d.id ? d.textColor : 'text-slate-800'}`}>
                                        {d.label}
                                    </span>
                                    <p className={`text-sm mt-1 transition-colors ${selectedDiff === d.id ? d.textColor.replace('text-', 'text-opacity-80 text-') : 'text-slate-500'}`}>
                                        {d.desc}
                                    </p>
                                </div>
                                <div className={`w-4 h-4 rounded-full border-2 transition-colors flex-shrink-0 ${selectedDiff === d.id
                                        ? `${d.textColor.replace('text-', 'border-')} ${d.textColor.replace('text-', 'bg-')}`
                                        : 'border-slate-300'
                                    }`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Question Count */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-300 flex flex-col">
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-5 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs">2</span>
                        Number of Questions
                    </h2>
                    <div className="grid grid-cols-2 gap-4 flex-grow content-start">
                        {QUESTION_COUNTS.map((n) => (
                            <button
                                key={n}
                                onClick={() => setQuestionCount(n)}
                                className={`flex flex-col items-center justify-center py-6 rounded-xl border-2 transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] ${questionCount === n
                                    ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-500/20'
                                    : 'border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50'
                                    }`}
                            >
                                <span className={`text-3xl font-bold mb-1 transition-colors ${questionCount === n ? 'text-indigo-600' : 'text-slate-700'}`}>
                                    {n}
                                </span>
                                <span className={`text-xs font-medium uppercase tracking-wide transition-colors ${questionCount === n ? 'text-indigo-400' : 'text-slate-400'}`}>
                                    Questions
                                </span>
                                <span className={`text-xs mt-2 px-2 py-0.5 rounded-full ${questionCount === n ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                                    ~{n * 2} mins
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Start Button */}
            <div className="pt-4">
                <button
                    onClick={handleStart}
                    className="group relative w-full overflow-hidden rounded-2xl font-bold text-lg flex items-center justify-center gap-3 py-5 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/30 active:scale-[0.98] bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative">Start Assessment</span>
                    <ChevronRight className="w-6 h-6 relative group-hover:translate-x-1 transition-transform duration-300" />
                </button>
            </div>
        </div>
    );
}
