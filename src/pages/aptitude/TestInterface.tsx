import { useState, useCallback, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, Flag, Send, AlertCircle, X } from 'lucide-react';
import type { Question, UserAnswer, PlatformSource } from '../../types/aptitude';
import { useTimer } from '../../hooks/useTimer';

interface TestInterfaceProps {
    questions: Question[];
    totalSeconds: number;
    onSubmit: (answers: UserAnswer[], timeTakenSeconds: number) => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export function TestInterface({ questions, totalSeconds, onSubmit }: TestInterfaceProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
    const [flagged, setFlagged] = useState<Set<number>>(new Set());
    const [startTime] = useState(Date.now());
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    // Prevent accidental navigation
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = ''; // Standard way to show browser's leave prompt
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    const submitAnswers = useCallback(() => {
        const timeTaken = Math.round((Date.now() - startTime) / 1000);
        const userAnswers: UserAnswer[] = questions.map((q, idx) => ({
            questionId: q.id,
            selectedIndex: answers[idx],
            isCorrect: answers[idx] === q.correct,
        }));
        onSubmit(userAnswers, timeTaken);
    }, [answers, questions, onSubmit, startTime]);

    const { secondsLeft, formatted } = useTimer({
        initialSeconds: totalSeconds,
        onExpire: submitAnswers,
        autoStart: true,
    });

    const selectOption = (idx: number) => {
        setAnswers((prev) => {
            const next = [...prev];
            next[currentIndex] = idx;
            return next;
        });

        // Auto-advance after small delay if not the last question and option changed
        if (currentIndex < questions.length - 1 && answers[currentIndex] !== idx) {
            setTimeout(() => {
                setCurrentIndex(i => Math.min(questions.length - 1, i + 1));
            }, 500);
        }
    };

    const toggleFlag = () => {
        setFlagged((prev) => {
            const next = new Set(prev);
            if (next.has(currentIndex)) next.delete(currentIndex);
            else next.add(currentIndex);
            return next;
        });
    };

    const question = questions[currentIndex];
    const progress = ((currentIndex) / questions.length) * 100;
    const answeredCount = answers.filter((a) => a !== null).length;
    const isLowTime = secondsLeft < 60;
    const isVeryLowTime = secondsLeft < 30;

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            {/* Top Status Bar */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-600">
                        {answeredCount} / {questions.length} answered
                    </span>
                </div>
                <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold text-sm transition-colors ${isVeryLowTime
                        ? 'bg-rose-100 text-rose-700 animate-pulse'
                        : isLowTime
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                >
                    <Clock className="w-4 h-4" />
                    {formatted}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Card Header */}
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-800">
                            Question {currentIndex + 1} <span className="text-slate-400">/ {questions.length}</span>
                        </span>
                        <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium">
                            {question.category}
                        </span>
                        <span
                            className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${question.difficulty === 'hard'
                                ? 'bg-rose-100 text-rose-700'
                                : question.difficulty === 'medium'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-emerald-100 text-emerald-700'
                                }`}
                        >
                            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                        </span>
                        <SourceBadge source={question.source} />
                    </div>
                    <button
                        onClick={toggleFlag}
                        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${flagged.has(currentIndex)
                            ? 'bg-amber-100 text-amber-700'
                            : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                            }`}
                    >
                        <Flag className="w-3.5 h-3.5" />
                        {flagged.has(currentIndex) ? 'Flagged' : 'Flag'}
                    </button>
                </div>

                {/* Question Body */}
                <div className="p-8">
                    <h2 className="text-base font-medium text-slate-900 mb-8 leading-relaxed whitespace-pre-line">
                        {question.text}
                    </h2>

                    <div className="space-y-3">
                        {question.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => selectOption(idx)}
                                className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-150 flex items-center gap-4 group ${answers[currentIndex] === idx
                                    ? 'border-indigo-500 bg-indigo-50'
                                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                                    }`}
                            >
                                <span
                                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${answers[currentIndex] === idx
                                        ? 'border-indigo-500 bg-indigo-500 text-white'
                                        : 'border-slate-300 text-slate-500 group-hover:border-indigo-400 group-hover:text-indigo-600'
                                        }`}
                                >
                                    {OPTION_LABELS[idx]}
                                </span>
                                <span className={`text-sm font-medium ${answers[currentIndex] === idx ? 'text-indigo-800' : 'text-slate-700'}`}>
                                    {option}
                                </span>
                                {answers[currentIndex] === idx && (
                                    <CheckCircle2 className="w-4 h-4 text-indigo-500 ml-auto flex-shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Card Footer */}
                <div className="px-8 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                    <button
                        onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                        disabled={currentIndex === 0}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>

                    {currentIndex === questions.length - 1 ? (
                        <button
                            onClick={() => setShowSubmitModal(true)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-indigo-500/25"
                        >
                            <Send className="w-4 h-4" />
                            Submit Test
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                            className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-indigo-500/25"
                        >
                            Next
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Question Navigator */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <p className="text-xs text-slate-500 mb-3 font-medium">Quick Navigation</p>
                <div className="flex flex-wrap gap-2">
                    {questions.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors border ${currentIndex === idx
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : flagged.has(idx)
                                    ? 'bg-amber-100 text-amber-700 border-amber-300'
                                    : answers[idx] !== null
                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                                        : 'bg-slate-100 text-slate-500 border-slate-200 hover:border-indigo-300'
                                }`}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-4 mt-3">
                    <Legend color="bg-indigo-600" label="Current" />
                    <Legend color="bg-emerald-100 border border-emerald-300" label="Answered" />
                    <Legend color="bg-amber-100 border border-amber-300" label="Flagged" />
                    <Legend color="bg-slate-100 border border-slate-200" label="Unanswered" />
                </div>
            </div>

            {/* Submit Confirmation Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-indigo-500" />
                                Submit Assessment?
                            </h3>
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-slate-600 mb-6 font-medium">
                                Are you sure you want to completely submit your test? You cannot return and change answers.
                            </p>

                            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Answered</p>
                                    <p className="text-emerald-600 font-bold text-lg">{answeredCount} <span className="text-emerald-600/50 text-sm">/ {questions.length}</span></p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Unanswered</p>
                                    <p className={`font-bold text-lg ${questions.length - answeredCount > 0 ? 'text-rose-500' : 'text-slate-400'}`}>
                                        {questions.length - answeredCount}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowSubmitModal(false)}
                                    className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-colors"
                                >
                                    Review Answers
                                </button>
                                <button
                                    onClick={() => {
                                        setShowSubmitModal(false);
                                        submitAnswers();
                                    }}
                                    className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 hover:shadow-md transition-all active:scale-95"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Legend({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded ${color}`} />
            <span className="text-xs text-slate-500">{label}</span>
        </div>
    );
}

const SOURCE_STYLES: Record<PlatformSource, { bg: string; text: string; label: string }> = {
    GeeksforGeeks: { bg: 'bg-green-100', text: 'text-green-800', label: 'GFG' },
    LeetCode: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'LeetCode' },
    HackerRank: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'HackerRank' },
    InterviewBit: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'InterviewBit' },
    Glassdoor: { bg: 'bg-teal-100', text: 'text-teal-800', label: 'Glassdoor' },
    General: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'General' },
};

function SourceBadge({ source }: { source: PlatformSource }) {
    const s = SOURCE_STYLES[source] ?? SOURCE_STYLES.General;
    return (
        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${s.bg} ${s.text}`}>
            {s.label}
        </span>
    );
}
