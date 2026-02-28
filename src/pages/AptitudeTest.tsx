import { useState } from 'react';
import { Brain, CheckCircle2, ChevronRight, AlertTriangle, Clock, Target } from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    category: 'Logical Reasoning',
    difficulty: 'Medium',
    text: 'If all Bloops are Razzies and all Razzies are Lazzies, are all Bloops definitely Lazzies?',
    options: ['Yes', 'No', 'Cannot be determined'],
    correct: 0,
  },
  {
    id: 2,
    category: 'Quantitative Aptitude',
    difficulty: 'Hard',
    text: 'A train 125 m long passes a man, running at 5 km/hr in the same direction in which the train is going, in 10 seconds. The speed of the train is:',
    options: ['45 km/hr', '50 km/hr', '54 km/hr', '55 km/hr'],
    correct: 1,
  },
  {
    id: 3,
    category: 'Verbal Ability',
    difficulty: 'Medium',
    text: 'Choose the word which is most nearly the OPPOSITE in meaning to the word "OMINOUS".',
    options: ['Auspicious', 'Gloomy', 'Threatening', 'Dark'],
    correct: 0,
  },
];

export function AptitudeTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  const handleNext = () => {
    if (selectedOption === QUESTIONS[currentQuestion].correct) {
      setScore(score + 1);
    }
    
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Assessment Complete</h2>
          <p className="text-slate-500 mb-8">You have completed the adaptive aptitude test.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
              <div className="text-sm font-medium text-slate-500 mb-1">Final Score</div>
              <div className="text-3xl font-bold text-indigo-600">{score} / {QUESTIONS.length}</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
              <div className="text-sm font-medium text-slate-500 mb-1">Percentile</div>
              <div className="text-3xl font-bold text-emerald-600">82nd</div>
            </div>
          </div>

          <div className="text-left bg-amber-50 rounded-lg p-4 border border-amber-100 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-900">Area for Improvement</h4>
              <p className="text-sm text-amber-700 mt-1">Your performance in Quantitative Aptitude (Speed & Distance) was below average. We recommend reviewing the related learning paths.</p>
            </div>
          </div>

          <button 
            onClick={() => {
              setCurrentQuestion(0);
              setSelectedOption(null);
              setScore(0);
              setIsFinished(false);
            }}
            className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-md text-sm transition-colors"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    );
  }

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Adaptive Aptitude Testing</h1>
        <p className="text-slate-500 mt-1">Difficulty adjusts in real-time based on your performance.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-900">Question {currentQuestion + 1} of {QUESTIONS.length}</span>
            <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium">
              {question.category}
            </span>
            <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${
              question.difficulty === 'Hard' ? 'bg-rose-100 text-rose-700' :
              question.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
              'bg-emerald-100 text-emerald-700'
            }`}>
              {question.difficulty}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
            <Clock className="w-4 h-4" /> 01:45
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1">
          <div className="bg-indigo-600 h-1 transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Question Content */}
        <div className="p-8 flex-1 flex flex-col">
          <h2 className="text-lg font-medium text-slate-900 mb-8 leading-relaxed">
            {question.text}
          </h2>

          <div className="space-y-3 mt-auto">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedOption(idx)}
                className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                  selectedOption === idx 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900' 
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="font-medium">{option}</span>
                {selectedOption === idx && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={handleNext}
            disabled={selectedOption === null}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-2.5 px-6 rounded-md text-sm transition-colors flex items-center gap-2"
          >
            {currentQuestion === QUESTIONS.length - 1 ? 'Finish Test' : 'Next Question'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
