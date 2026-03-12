import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Trophy, Clock, Target, RotateCcw, Settings2, TrendingUp, AlertTriangle } from 'lucide-react';
import type { TestResult } from '../../types/aptitude';

interface TestResultsProps {
    result: TestResult;
    onRetake: () => void;
    onReconfigure: () => void;
}

function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
}

function getGrade(accuracy: number): { label: string; color: string } {
    if (accuracy >= 90) return { label: 'Excellent', color: 'text-emerald-600' };
    if (accuracy >= 75) return { label: 'Good', color: 'text-indigo-600' };
    if (accuracy >= 60) return { label: 'Average', color: 'text-amber-600' };
    return { label: 'Needs Work', color: 'text-rose-600' };
}

export function TestResults({ result, onRetake, onReconfigure }: TestResultsProps) {
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
    const grade = getGrade(result.accuracy);

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Hero Score Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 overflow-hidden relative">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
                    <Trophy className="w-48 h-48 text-white transform rotate-12" />
                </div>

                <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 px-8 py-12 text-white text-center relative overflow-hidden">
                    <div className="animate-in zoom-in duration-700 delay-150 relative z-10">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                            <Trophy className="w-10 h-10 text-white drop-shadow-md" />
                        </div>
                        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Assessment Complete!</h1>
                        <p className={`text-indigo-100 text-sm font-medium inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md`}>
                            Grade: <span className="text-white font-bold">{grade.label}</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 divide-x divide-slate-100 text-center py-8 px-4 bg-white relative z-10">
                    <div className="px-4 animate-in slide-in-from-bottom-2 duration-500 delay-300">
                        <div className="flex items-center justify-center gap-1.5 mb-2">
                            <Target className="w-4 h-4 text-indigo-500" />
                            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Score</span>
                        </div>
                        <div className="text-3xl font-extrabold text-slate-900">
                            {result.score}<span className="text-slate-400 text-xl font-medium">/{result.total}</span>
                        </div>
                    </div>
                    <div className="px-4 animate-in slide-in-from-bottom-2 duration-500 delay-400">
                        <div className="flex items-center justify-center gap-1.5 mb-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Accuracy</span>
                        </div>
                        <div className={`text-3xl font-extrabold ${grade.color}`}>{result.accuracy}%</div>
                    </div>
                    <div className="px-4 animate-in slide-in-from-bottom-2 duration-500 delay-500">
                        <div className="flex items-center justify-center gap-1.5 mb-2">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Time</span>
                        </div>
                        <div className="text-3xl font-extrabold text-slate-900">{formatTime(result.timeTakenSeconds)}</div>
                    </div>
                </div>
            </div>

            {/* Category Breakdown Chart */}
            {result.categoryBreakdown.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 animate-in slide-in-from-bottom-2 duration-500 delay-500 fill-mode-both">
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest mb-6">
                        Performance by Category
                    </h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={result.categoryBreakdown} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <XAxis
                                dataKey="category"
                                tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                            <Tooltip
                                formatter={(value, name) => [value, name === 'correct' ? 'Correct' : 'Total']}
                                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ fill: '#f8fafc' }}
                            />
                            <Bar dataKey="correct" radius={[6, 6, 0, 0]} maxBarSize={48}>
                                {result.categoryBreakdown.map((entry, idx) => {
                                    const pct = entry.total > 0 ? entry.correct / entry.total : 0;
                                    const color = pct >= 0.75 ? '#10b981' : pct >= 0.5 ? '#f59e0b' : '#f43f5e';
                                    return <Cell key={idx} fill={color} />;
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="flex items-center justify-center gap-6 mt-4">
                        <Legend color="bg-emerald-500" label="≥ 75%" />
                        <Legend color="bg-amber-400" label="50–74%" />
                        <Legend color="bg-rose-500" label="< 50%" />
                    </div>
                </div>
            )}

            {/* Weak Areas */}
            {result.weakAreas.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-semibold text-amber-900 mb-1">Areas to Improve</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {result.weakAreas.map((area) => (
                                <span key={area} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium border border-amber-200">
                                    {area}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-amber-700 mt-2">
                            Focus on these topics in your preparation to improve your score.
                        </p>
                    </div>
                </div>
            )}

            {/* Answer Review */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
                    Answer Review
                </h2>
                <div className="space-y-2">
                    {result.questions.map((q, idx) => {
                        const answer = result.answers[idx];
                        const isCorrect = answer?.isCorrect;
                        const isExpanded = expandedIdx === idx;

                        return (
                            <div
                                key={q.id}
                                className={`rounded-xl border transition-all duration-300 ${isCorrect
                                    ? 'border-emerald-200 bg-emerald-50/40'
                                    : 'border-rose-200 bg-rose-50/40'} ${isExpanded ? 'shadow-md' : 'hover:shadow-sm'}`}
                            >
                                <button
                                    onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                                    className="w-full flex items-center justify-between px-5 py-4 text-left focus:outline-none"
                                >
                                    <div className="flex items-center gap-3">
                                        {isCorrect ? (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                                        )}
                                        <span className="text-sm font-semibold text-slate-700 line-clamp-1">
                                            <span className="text-slate-400 mr-2">Q{idx + 1}.</span>
                                            {q.text.length > 80 ? q.text.slice(0, 80) + '…' : q.text}
                                        </span>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200" />
                                    )}
                                </button>

                                {isExpanded && (
                                    <div className="px-5 pb-4 space-y-3 border-t border-slate-100 pt-3">
                                        <p className="text-sm text-slate-800 font-medium whitespace-pre-line">{q.text}</p>
                                        <div className="space-y-1.5">
                                            {q.options.map((opt, oIdx) => {
                                                const isSelected = answer?.selectedIndex === oIdx;
                                                const isCorrectOption = q.correct === oIdx;
                                                return (
                                                    <div
                                                        key={oIdx}
                                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm ${isCorrectOption
                                                            ? 'bg-emerald-100 text-emerald-800 font-medium'
                                                            : isSelected && !isCorrect
                                                                ? 'bg-rose-100 text-rose-800'
                                                                : 'text-slate-600'
                                                            }`}
                                                    >
                                                        <span className="font-bold text-xs w-5 flex-shrink-0">
                                                            {['A', 'B', 'C', 'D'][oIdx]}
                                                        </span>
                                                        <span>{opt}</span>
                                                        {isCorrectOption && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-auto" />}
                                                        {isSelected && !isCorrect && !isCorrectOption && (
                                                            <XCircle className="w-3.5 h-3.5 text-rose-600 ml-auto" />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mt-2">
                                            <p className="text-xs font-semibold text-slate-600 mb-1">💡 Explanation</p>
                                            <p className="text-xs text-slate-700 leading-relaxed">{q.explanation}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pb-8 animate-in slide-in-from-bottom-2 duration-500 delay-1000 fill-mode-both">
                <button
                    onClick={onReconfigure}
                    className="flex items-center gap-2 px-6 py-4 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-bold tracking-wide hover:border-slate-300 hover:bg-slate-50 transition-all hover:-translate-y-0.5"
                >
                    <Settings2 className="w-5 h-5" />
                    Change Config
                </button>
                <button
                    onClick={onRetake}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-sm font-bold tracking-wide transition-all hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:scale-95"
                >
                    <RotateCcw className="w-5 h-5" />
                    Retake Test
                </button>
            </div>
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
