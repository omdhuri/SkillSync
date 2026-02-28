import { useState } from 'react';
import { FileText, UploadCloud, CheckCircle2, AlertTriangle, XCircle, RefreshCw, ChevronRight } from 'lucide-react';

export function AtsLinter() {
  const [isScanning, setIsScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowResults(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">ATS Linter & Validator</h1>
        <p className="text-slate-500 mt-1">Strict schema validation to ensure your resume passes automated parsers.</p>
      </div>

      {!showResults ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-3xl mx-auto mt-8">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer">
            <UploadCloud className="w-12 h-12 text-indigo-500 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">Upload Resume for Linting</h3>
            <p className="text-sm text-slate-500 mb-6">PDF or DOCX format. Max 5MB.</p>
            <button 
              onClick={handleScan}
              disabled={isScanning}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-md text-sm transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Running Linter...
                </>
              ) : (
                'Select File'
              )}
            </button>
          </div>
          
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm font-semibold text-slate-900">Format Check</div>
              <div className="text-xs text-slate-500 mt-1">Parses structure & layout</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Keyword Match</div>
              <div className="text-xs text-slate-500 mt-1">Checks against industry terms</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Readability</div>
              <div className="text-xs text-slate-500 mt-1">Analyzes action verbs & impact</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Score Overview */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
              <h3 className="text-sm font-semibold text-slate-900 mb-6">ATS Compatibility Score</h3>
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                  <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="351.8" strokeDashoffset="105.5" className="text-amber-500" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-slate-900">70%</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-6">Your resume is readable, but missing key structural elements that ATS bots look for.</p>
              <button 
                onClick={() => setShowResults(false)}
                className="mt-6 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2 px-4 rounded-md text-sm transition-colors"
              >
                Upload New Version
              </button>
            </div>
          </div>

          {/* Detailed Report */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-base font-semibold text-slate-900">Linting Report</h3>
              </div>
              
              <div className="divide-y divide-slate-100">
                {/* Error */}
                <div className="p-6 flex gap-4 bg-rose-50/30">
                  <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-rose-900">Unreadable Contact Information</h4>
                    <p className="text-sm text-rose-700 mt-1">The ATS could not parse your phone number or LinkedIn URL. Ensure they are in standard text format, not embedded in images or headers.</p>
                  </div>
                </div>

                {/* Warning */}
                <div className="p-6 flex gap-4 bg-amber-50/30">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900">Missing Action Verbs</h4>
                    <p className="text-sm text-amber-700 mt-1">3 bullet points in your experience section do not start with strong action verbs (e.g., "Responsible for" instead of "Spearheaded").</p>
                  </div>
                </div>

                {/* Warning */}
                <div className="p-6 flex gap-4 bg-amber-50/30">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-900">Complex Formatting Detected</h4>
                    <p className="text-sm text-amber-700 mt-1">Found tables or multi-column layouts. Many older ATS systems read left-to-right, top-to-bottom, which scrambles column data.</p>
                  </div>
                </div>

                {/* Success */}
                <div className="p-6 flex gap-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Standard Section Headings</h4>
                    <p className="text-sm text-slate-500 mt-1">Successfully identified "Experience", "Education", and "Skills" sections.</p>
                  </div>
                </div>
                
                {/* Success */}
                <div className="p-6 flex gap-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">File Format</h4>
                    <p className="text-sm text-slate-500 mt-1">PDF format is text-searchable (not a flattened image).</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-indigo-900">Need a guaranteed ATS-friendly format?</h4>
                <p className="text-sm text-indigo-700 mt-1">Use our Resume Builder to automatically generate a perfectly structured PDF.</p>
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md text-sm transition-colors flex items-center gap-2 whitespace-nowrap">
                Go to Builder <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
