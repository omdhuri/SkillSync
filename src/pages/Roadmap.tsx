import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ChevronDown, BookOpen, Code, FileText, Briefcase, Target, Download, ExternalLink } from 'lucide-react';
import { ROADMAPS, ROADMAP_KEYS, type RoadmapData } from '../data/roadmaps';
import { getData, setData } from '../lib/storage';

const ROLE_ICONS: Record<string, any> = {
  frontend: BookOpen,
  backend: Code,
  'full-stack': FileText,
  'data-science': Target,
  devops: Briefcase,
};

const PDF_FILES: Record<string, string> = {
  frontend: 'frontend.pdf',
  backend: 'backend.pdf',
  'full-stack': 'full-stack.pdf',
  'data-science': 'ai-data-scientist.pdf',
  devops: 'devops.pdf',
  'ai-data-scientist': 'ai-data-scientist.pdf',
  'ai-engineer': 'ai-engineer.pdf',
  android: 'android.pdf',
  'bi-analyst': 'bi-analyst.pdf',
  blockchain: 'blockchain.pdf',
  'cyber-security': 'cyber-security.pdf',
  'data-analyst': 'data-analyst.pdf',
  'data-engineer': 'data-engineer.pdf',
  devrel: 'devrel.pdf',
  'engineering-manager': 'engineering-manager.pdf',
  'game-developer': 'game-developer.pdf',
  ios: 'ios.pdf',
  'machine-learning': 'machine-learning.pdf',
  mlops: 'mlops.pdf',
  'product-manager': 'product-manager.pdf',
  'server-side-game-developer': 'server-side-game-developer.pdf',
  'software-architect': 'software-architect.pdf',
  'technical-writer': 'technical-writer.pdf',
  'ux-design': 'ux-design.pdf',
};

export function Roadmap() {
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string>('frontend');
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});

  // Load saved selection and progress on mount
  useEffect(() => {
    const savedRoadmap = getData('selected_roadmap', 'frontend');
    const savedProgress = getData('roadmap_progress', {});
    setSelectedRoadmapId(savedRoadmap);
    setCompletedTopics(savedProgress);
  }, []);

  // Save roadmap selection when changed
  useEffect(() => {
    setData('selected_roadmap', selectedRoadmapId);
  }, [selectedRoadmapId]);

  // Save progress when topics are toggled
  useEffect(() => {
    setData('roadmap_progress', completedTopics);
  }, [completedTopics]);

  const roadmap = ROADMAPS[selectedRoadmapId];
  const totalTopics = roadmap.phases.reduce((acc, phase) => acc + phase.topics.length, 0);
  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalTopics) * 100);

  const toggleTopic = (topicId: string) => {
    setCompletedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Career Roadmap</h1>
        <p className="text-slate-500 mt-1">Your personalized path to mastering new skills</p>
      </div>

      {/* Roadmap Selector */}
      <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-xl border border-indigo-100 shadow-md p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <label className="text-sm font-semibold text-slate-800">
            Select Your Career Path
          </label>
        </div>
        <div className="relative">
          <select
            value={selectedRoadmapId}
            onChange={(e) => setSelectedRoadmapId(e.target.value)}
            className="w-full appearance-none bg-white border border-indigo-200 rounded-xl px-4 py-3.5 pr-12 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent cursor-pointer shadow-sm hover:border-indigo-300 transition-colors"
          >
            {ROADMAP_KEYS.map(key => (
              <option key={key} value={key}>
                {ROADMAPS[key].name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 pointer-events-none" />
        </div>
        <p className="text-sm text-slate-600 mt-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
          {roadmap.description}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Your Progress</span>
          <span className="text-sm font-semibold text-indigo-600">{progressPercent}% complete</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2">
          {completedCount} of {totalTopics} topics completed
        </p>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
        <div className="relative border-l-2 border-slate-100 ml-4 space-y-10">
          {roadmap.phases.map((phase, phaseIndex) => (
            <div key={phase.id} className="relative pl-8">
              {/* Timeline Node */}
              <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full flex items-center justify-center bg-white text-indigo-600">
                <Circle className="w-4 h-4 fill-indigo-600" />
              </div>

              {/* Phase Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-slate-900">{phase.title}</h3>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded">
                    {phase.estimatedWeeks} weeks
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-4">{phase.description}</p>

                {/* Topics */}
                <div className="space-y-2">
                  {phase.topics.map((topic) => {
                    const isCompleted = completedTopics[topic.id];
                    return (
                      <button
                        key={topic.id}
                        onClick={() => toggleTopic(topic.id)}
                        className={`w-full text-left flex items-start gap-3 p-3 rounded-lg transition-all ${
                          isCompleted
                            ? 'bg-emerald-50 border border-emerald-100'
                            : 'bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50'
                        }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            isCompleted ? 'text-emerald-900' : 'text-slate-700'
                          }`}>
                            {topic.title}
                          </p>
                          <p className={`text-xs mt-0.5 ${
                            isCompleted ? 'text-emerald-600' : 'text-slate-500'
                          }`}>
                            {topic.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Download Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Download Full Roadmap PDF</h3>
              <p className="text-sm text-indigo-100 mt-1">
                Get the complete detailed roadmap with topics, resources, and timelines for {roadmap.name}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <a
            href={`/Resources/Roadmap Pdf/${PDF_FILES[selectedRoadmapId]}`}
            download
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-50 transition-colors shadow-md"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
          <a
            href={`/Resources/Roadmap Pdf/${PDF_FILES[selectedRoadmapId]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-indigo-700/50 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Preview
          </a>
        </div>
      </div>
    </div>
  );
}
