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
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Hero Score Card */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 px-8 py-10 text-white text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-1">Assessment Complete!</h1>
                    <p className={`text-indigo-200 text-sm font-medium ${grade.color.replace('text-', 'text-')}`}>
                        Grade: <span className="text-white font-bold">{grade.label}</span>
                    </p>
                </div>

                <div className="grid grid-cols-3 divide-x divide-slate-100 text-center py-6 px-4">
                    <div className="px-4">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <Target className="w-4 h-4 text-indigo-500" />
                            <span className="text-xs text-slate-500 font-medium">Score</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                            {result.score}<span className="text-slate-400 text-lg">/{result.total}</span>
                        </div>
                    </div>
                    <div className="px-4">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs text-slate-500 font-medium">Accuracy</span>
                        </div>
                        <div className={`text-2xl font-bold ${grade.color}`}>{result.accuracy}%</div>
                    </div>
                    <div className="px-4">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <span className="text-xs text-slate-500 font-medium">Time</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{formatTime(result.timeTakenSeconds)}</div>
                    </div>
                </div>
            </div>

            {/* Category Breakdown Chart */}
            {result.categoryBreakdown.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-6">
                        Performance by Category
                    </h2>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={result.categoryBreakdown} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <XAxis
                                dataKey="category"
                                tick={{ fontSize: 11, fill: '#64748b' }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                            <Tooltip
                                formatter={(value, name) => [value, name === 'correct' ? 'Correct' : 'Total']}
                                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}
                            />
                            <Bar dataKey="correct" radius={[4, 4, 0, 0]} maxBarSize={48}>
                                {result.categoryBreakdown.map((entry, idx) => {
                                    const pct = entry.total > 0 ? entry.correct / entry.total : 0;
                                    const color = pct >= 0.75 ? '#10b981' : pct >= 0.5 ? '#f59e0b' : '#f43f5e';
                                    return <Cell key={idx} fill={color} />;
                                })}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="flex items-center justify-center gap-6 mt-2">
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
                                className={`rounded-xl border ${isCorrect ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-200 bg-rose-50/40'
                                    }`}
                            >
                                <button
                                    onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                                    className="w-full flex items-center justify-between px-5 py-3.5 text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        {isCorrect ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                                        )}
                                        <span className="text-sm font-medium text-slate-700 line-clamp-1">
                                            <span className="text-slate-400 mr-2">Q{idx + 1}.</span>
                                            {q.text.length > 80 ? q.text.slice(0, 80) + '…' : q.text}
                                        </span>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
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
            <div className="flex gap-3 pb-8">
                <button
                    onClick={onReconfigure}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-slate-200 text-slate-700 text-sm font-semibold hover:border-slate-300 hover:bg-slate-50 transition-colors"
                >
                    <Settings2 className="w-4 h-4" />
                    Change Config
                </button>
                <button
                    onClick={onRetake}
                    className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-md shadow-indigo-200"
                >
                    <RotateCcw className="w-4 h-4" />
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
