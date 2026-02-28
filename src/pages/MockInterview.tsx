import { useState, useEffect } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, User, MessageSquare } from 'lucide-react';

export function MockInterview() {
  const [isStarted, setIsStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStarted) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Biometric Mock Interview</h1>
        <p className="text-slate-500 mt-1">High-fidelity sandbox with AI interviewer and sentiment analysis.</p>
      </div>

      {!isStarted ? (
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center p-12 text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <Video className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Ready for your interview?</h2>
          <p className="text-slate-500 max-w-md mb-8">
            This session will test your React and System Design knowledge. Make sure your camera and microphone are working properly.
          </p>
          
          <div className="flex gap-4 mb-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                <Mic className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-slate-500">Mic Check</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                <Video className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-slate-500">Cam Check</span>
            </div>
          </div>

          <button 
            onClick={() => setIsStarted(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
          >
            Start Interview
          </button>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
          {/* Video Area */}
          <div className="lg:col-span-3 bg-slate-900 rounded-xl overflow-hidden relative flex flex-col shadow-lg">
            {/* Main Video (AI Interviewer) */}
            <div className="flex-1 relative">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1200" 
                alt="AI Interviewer" 
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                Sarah (AI Interviewer)
              </div>
            </div>

            {/* Picture-in-Picture (User) */}
            <div className="absolute top-4 right-4 w-48 aspect-video bg-slate-800 rounded-lg border-2 border-slate-700 overflow-hidden shadow-xl">
              {isVideoOff ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-800">
                  <User className="w-8 h-8 text-slate-500" />
                </div>
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400" 
                  alt="You" 
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium">
                You
              </div>
            </div>

            {/* Controls */}
            <div className="h-20 bg-slate-950 flex items-center justify-center gap-6 px-6">
              <div className="absolute left-6 text-slate-400 font-mono text-sm">
                {formatTime(timer)}
              </div>
              
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={() => setIsVideoOff(!isVideoOff)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isVideoOff ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
              >
                {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={() => setIsStarted(false)}
                className="w-12 h-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-colors"
              >
                <PhoneOff className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Live Transcript */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-900">Live Transcript</h3>
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm">
                <div className="space-y-1">
                  <span className="font-semibold text-indigo-600 text-xs">Sarah</span>
                  <p className="text-slate-700 bg-indigo-50 p-2 rounded-lg rounded-tl-none">
                    Welcome! Let's start with a React question. Can you explain the difference between useMemo and useCallback?
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-slate-900 text-xs">You</span>
                  <p className="text-slate-600 bg-slate-100 p-2 rounded-lg rounded-tr-none">
                    Sure. useMemo is used to memoize a calculated value, while useCallback is used to memoize a function definition...
                  </p>
                </div>
              </div>
            </div>

            {/* Biometric Feedback */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Live Biometrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Eye Contact</span>
                    <span className="text-emerald-600">Good (85%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Speaking Pace</span>
                    <span className="text-amber-600">Slightly Fast</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                    <span>Confidence Score</span>
                    <span className="text-indigo-600">High (92%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
