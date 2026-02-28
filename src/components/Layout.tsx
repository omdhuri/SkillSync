import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  FileText, 
  BrainCircuit, 
  Mic, 
  Briefcase, 
  CircleDollarSign, 
  Search, 
  GraduationCap, 
  CheckSquare,
  Bell,
  Search as SearchIcon,
  Settings,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Roadmap', href: '/roadmap', icon: Map },
  { name: 'Resume Builder', href: '/resume-builder', icon: FileText },
  { name: 'Aptitude Test', href: '/aptitude-test', icon: BrainCircuit },
  { name: 'Mock Interview', href: '/mock-interview', icon: Mic },
  { name: 'Job Suggestions', href: '/job-suggestions', icon: Briefcase },
  { name: 'Salary Comp', href: '/salary-benchmarking', icon: CircleDollarSign },
  { name: 'Skill Gap', href: '/skill-gap-analyzer', icon: Search },
  { name: 'Learning Paths', href: '/learning-paths', icon: GraduationCap },
  { name: 'ATS Linter', href: '/ats-linter', icon: CheckSquare },
];

export function Layout() {
  const location = useLocation();
  const currentPathName = navigation.find(n => n.href === location.pathname)?.name || 'Dashboard';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen bg-slate-50 flex font-sans text-slate-800 selection:bg-indigo-500/30 overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-30 flex flex-col bg-white/80 backdrop-blur-xl border-r border-slate-200/60 transition-all duration-300 ease-in-out overflow-hidden",
          isSidebarOpen 
            ? "w-64 translate-x-0" 
            : "w-64 -translate-x-full md:w-[72px] md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full w-full">
          <div className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-slate-200/60 flex-shrink-0">
            <div className={cn("flex items-center gap-2.5", !isSidebarOpen && "md:justify-center md:w-full")}>
              {/* Premium Logo */}
              <div className="relative w-8 h-8 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-sm" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  {/* Indigo Top Loop */}
                  <path d="M 14 10 A 4 4 0 0 0 6 10 V 14 A 4 4 0 0 0 10 18 H 11" stroke="currentColor" className="text-indigo-600" />
                  {/* Amber Bottom Loop & Arrow */}
                  <path d="M 10 14 A 4 4 0 0 0 18 14 V 10 L 22 6" stroke="currentColor" className="text-amber-500" />
                  <path d="M 17 6 L 22 6 L 22 11" stroke="currentColor" className="text-amber-500" />
                </svg>
              </div>
              <span className={cn("font-bold text-lg tracking-tight text-slate-800 transition-opacity duration-200", !isSidebarOpen && "md:hidden")}>SkillSync</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 scrollbar-hide">
            <div className={cn("text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3 transition-opacity duration-200", !isSidebarOpen && "md:opacity-0 md:h-0 md:mb-0 md:overflow-hidden")}>Modules</div>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  title={!isSidebarOpen ? item.name : undefined}
                  className={cn(
                    "flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                    isSidebarOpen ? "gap-3 px-3 py-2.5" : "justify-center p-2.5 md:px-0",
                    isActive 
                      ? "bg-indigo-50/80 text-indigo-600 shadow-sm shadow-indigo-100/50 border border-indigo-100/50" 
                      : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900 border border-transparent"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-indigo-600" : "text-slate-400")} />
                  <span className={cn("transition-opacity duration-200 whitespace-nowrap", !isSidebarOpen && "md:hidden")}>{item.name}</span>
                </NavLink>
              );
            })}
          </div>
          
          <div className="p-4 border-t border-slate-200/60">
            <NavLink
              to="/settings"
              title={!isSidebarOpen ? "Settings" : undefined}
              className={({ isActive }) => cn(
                "flex items-center rounded-lg text-sm font-medium transition-all duration-200",
                isSidebarOpen ? "gap-3 px-3 py-2.5" : "justify-center p-2.5 md:px-0",
                isActive 
                  ? "bg-indigo-50/80 text-indigo-600 shadow-sm shadow-indigo-100/50 border border-indigo-100/50" 
                  : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900 border border-transparent"
              )}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              <span className={cn("transition-opacity duration-200 whitespace-nowrap", !isSidebarOpen && "md:hidden")}>Settings</span>
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative h-full">
        {/* Vibrant Backdrop Blobs for Glassmorphism */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-400/10 blur-[120px]"></div>
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-amber-400/10 blur-[80px]"></div>
        </div>

        {/* Top Header */}
        <header className="h-16 bg-white/60 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-10 relative">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100/50 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center text-sm font-medium">
              <span className="text-slate-400 hidden sm:inline">SkillSync</span>
              <span className="mx-2 text-slate-300 hidden sm:inline">/</span>
              <span className="text-slate-800">{currentPathName}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="relative hidden sm:block">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-1.5 bg-white/80 border border-slate-200/80 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-64 transition-all shadow-sm"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded">⌘</kbd>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded">K</kbd>
              </div>
            </div>
            
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
            </button>
            
            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center overflow-hidden shadow-sm">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 z-10 relative">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
