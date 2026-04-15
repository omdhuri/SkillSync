import { useState, useRef } from 'react';
import { PlayCircle, ExternalLink, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import youtubeResources from '../data/youtube_resources.json';

interface Resource {
  title: string;
  url: string;
}

interface SkillResource {
  skill: string;
  resources: Resource[];
}

const YOUTUBE_RESOURCES: SkillResource[] = youtubeResources;

export function LearningPaths() {
  const [selectedSkill, setSelectedSkill] = useState<string>('Frontend');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const skills = YOUTUBE_RESOURCES.map(r => r.skill);
  const filteredSkills = skills.filter(skill => 
    skill.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const selectedResources = YOUTUBE_RESOURCES.find(r => r.skill === selectedSkill)?.resources || [];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /youtube\.com\/watch\?v=([^&]+)/,
      /youtu\.be\/([^?]+)/,
      /youtube\.com\/embed\/([^?]+)/,
      /youtube\.com\/v\/([^?]+)/
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  };

  const getChannelFromTitle = (title: string) => {
    const dashIndex = title.lastIndexOf(' – ');
    return dashIndex !== -1 ? title.substring(dashIndex + 3) : 'YouTube';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Curated Learning Paths</h1>
          <p className="text-slate-500 mt-1">Master skills with expert-curated YouTube tutorials</p>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-64 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Pills */}
      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-slate-600" />
        </button>
        
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-slate-600" />
        </button>

        {/* Pills Container */}
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-2 px-10 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {filteredSkills.length > 0 ? (
            filteredSkills.map(skill => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedSkill === skill
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:shadow-sm'
                }`}
              >
                {skill}
              </button>
            ))
          ) : (
            <p className="text-slate-500 text-sm py-2">No skills found</p>
          )}
        </div>
      </div>

      {/* Selected Skill Header */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">{selectedSkill}</span>
        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
          {selectedResources.length} videos
        </span>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {selectedResources.map((resource, idx) => {
          const thumbnail = getYouTubeThumbnail(resource.url);
          
          return (
            <a
              key={idx}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-slate-100">
                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt={resource.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <PlayCircle className="w-12 h-12 text-slate-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <PlayCircle className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {resource.title.includes(' – ') ? resource.title.split(' – ')[1].split('\n')[0] : 'YouTube Tutorial'}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <PlayCircle className="w-3 h-3" /> YouTube
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Empty State */}
      {selectedResources.length === 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <PlayCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No resources found</h3>
          <p className="text-sm text-slate-500">
            Select a different skill to view available learning resources.
          </p>
        </div>
      )}
    </div>
  );
}
