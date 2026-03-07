import { useState, useCallback } from 'react';
import type { TestConfig, UserAnswer, TestResult, Question } from '../types/aptitude';
import { getFilteredQuestions } from '../data/questions';
import { TestSetup } from './aptitude/TestSetup';
import { TestInterface } from './aptitude/TestInterface';
import { TestResults } from './aptitude/TestResults';

type View = 'setup' | 'test' | 'results';

/** Seconds per question based on difficulty */
function getTimerSeconds(count: number, difficulty: string): number {
  const secsPerQ = difficulty === 'hard' ? 150 : difficulty === 'medium' ? 120 : 90;
  return count * secsPerQ;
}

/** Compute per-category breakdown from answers + questions */
function buildCategoryBreakdown(questions: Question[], answers: UserAnswer[]) {
  const map = new Map<string, { correct: number; total: number }>();
  questions.forEach((q, idx) => {
    const cat = q.category;
    const entry = map.get(cat) ?? { correct: 0, total: 0 };
    entry.total++;
    if (answers[idx]?.isCorrect) entry.correct++;
    map.set(cat, entry);
  });
  return Array.from(map.entries()).map(([category, v]) => ({ category, ...v }));
}

/** Determine weak areas (categories with < 50% accuracy) */
function findWeakAreas(breakdown: { category: string; correct: number; total: number }[]): string[] {
  return breakdown
    .filter((b) => b.total > 0 && b.correct / b.total < 0.5)
    .map((b) => b.category);
}

export function AptitudeTest() {
  const [view, setView] = useState<View>('setup');
  const [config, setConfig] = useState<TestConfig | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<TestResult | null>(null);

  const handleStart = useCallback((cfg: TestConfig) => {
    const qs = getFilteredQuestions(cfg.role, cfg.language, cfg.difficulty, cfg.questionCount);
    setConfig(cfg);
    setQuestions(qs);
    setView('test');
  }, []);

  const handleSubmit = useCallback(
    (answers: UserAnswer[], timeTakenSeconds: number) => {
      if (!config) return;
      const score = answers.filter((a) => a.isCorrect).length;
      const accuracy = Math.round((score / answers.length) * 100);
      const breakdown = buildCategoryBreakdown(questions, answers);
      const weakAreas = findWeakAreas(breakdown);

      setResult({
        config,
        questions,
        answers,
        score,
        total: answers.length,
        accuracy,
        timeTakenSeconds,
        weakAreas,
        categoryBreakdown: breakdown,
      });
      setView('results');
    },
    [config, questions]
  );

  const handleRetake = useCallback(() => {
    if (!config) return;
    // Re-shuffle with same config
    const qs = getFilteredQuestions(config.role, config.language, config.difficulty, config.questionCount);
    setQuestions(qs);
    setResult(null);
    setView('test');
  }, [config]);

  const handleReconfigure = useCallback(() => {
    setResult(null);
    setConfig(null);
    setQuestions([]);
    setView('setup');
  }, []);

  if (view === 'setup') {
    return <TestSetup onStart={handleStart} />;
  }

  if (view === 'test' && config && questions.length > 0) {
    return (
      <TestInterface
        questions={questions}
        totalSeconds={getTimerSeconds(config.questionCount, config.difficulty)}
        onSubmit={handleSubmit}
      />
    );
  }

  if (view === 'results' && result) {
    return (
      <TestResults
        result={result}
        onRetake={handleRetake}
        onReconfigure={handleReconfigure}
      />
    );
  }

  // Fallback — no questions matched filters
  if (view === 'test' && questions.length === 0) {
    return (
      <div className="max-w-xl mx-auto mt-16 text-center space-y-4">
        <p className="text-slate-500">No questions found for the selected filters.</p>
        <button
          onClick={handleReconfigure}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          Try Different Configuration
        </button>
      </div>
    );
  }

  return null;
}
