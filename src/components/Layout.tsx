import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  FileText, 
  BrainCircuit, 
  Mic, 
  Briefcase, 
  Search, 
  GraduationCap, 
  CheckSquare,
  Bell,
  Search as SearchIcon,
  Settings,
  Sparkles,
  Menu,
  X,
  User,
  LogOut,
  CheckCircle2
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
  { name: 'Skill Gap', href: '/skill-gap-analyzer', icon: Search },
  { name: 'Learning Paths', href: '/learning-paths', icon: GraduationCap },
  { name: 'ATS Linter', href: '/ats-linter', icon: CheckSquare },
];

export function Layout() {
  const location = useLocation();
  const currentPathName = navigation.find(n => n.href === location.pathname)?.name || 'Dashboard';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Close dropdowns when clicking outside (simplified with an overlay for this demo)
  const closeAllDropdowns = () => {
    setIsNotificationsOpen(false);
    setIsProfileOpen(false);
    setIsSearchFocused(false);
  };

  return (
    <div className="h-screen bg-slate-50 flex font-sans text-slate-800 selection:bg-indigo-500/30 overflow-hidden">
      {/* Global Click-Outside Overlay for Dropdowns */}
      {(isNotificationsOpen || isProfileOpen || isSearchFocused) && (
        <div 
          className="fixed inset-0 z-[35] bg-slate-900/10 backdrop-blur-sm transition-all duration-300 animate-in fade-in" 
          onClick={closeAllDropdowns} 
        />
      )}

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[50] md:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed md:relative inset-y-0 left-0 z-[60] flex flex-col bg-white/80 backdrop-blur-xl border-r border-slate-200/60 transition-all duration-300 ease-in-out overflow-hidden",
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
        <header className="h-16 bg-white/60 backdrop-blur-md border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-6 flex-shrink-0 z-[40] relative">
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
            {/* Search */}
            <div className="relative hidden sm:block z-50">
              <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="pl-9 pr-4 py-1.5 bg-white/80 border border-slate-200/80 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-64 transition-all shadow-sm"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded">⌘</kbd>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-200 rounded">K</kbd>
              </div>
              
              {/* Search Dropdown */}
              {isSearchFocused && searchQuery.length > 0 && (
                <div className="absolute left-0 top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-slate-200 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Quick Results</div>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                    <SearchIcon className="w-4 h-4 text-slate-400" />
                    Search jobs for <span className="font-semibold">"{searchQuery}"</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    Find courses for <span className="font-semibold">"{searchQuery}"</span>
                  </button>
                </div>
              )}
            </div>
            
            {/* Notifications */}
            <div className="relative z-50">
              <button 
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className={cn(
                  "relative p-2 rounded-full transition-colors",
                  isNotificationsOpen ? "bg-slate-100 text-slate-800" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                )}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                    <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto scrollbar-hide">
                    <div className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 cursor-pointer transition-colors">
                      <p className="text-sm text-slate-800 font-medium">Resume Analysis Complete</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Your latest resume scored 85% for the Frontend Developer role.</p>
                      <p className="text-[10px] text-slate-400 mt-1.5">2 hours ago</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-slate-50 border-b border-slate-50 cursor-pointer transition-colors">
                      <p className="text-sm text-slate-800 font-medium">New Job Match</p>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Google is hiring a Senior UI/UX Developer. 92% match!</p>
                      <p className="text-[10px] text-slate-400 mt-1.5">5 hours ago</p>
                    </div>
                  </div>
                  <div className="px-4 py-2 border-t border-slate-100 text-center">
                    <button className="text-xs text-slate-500 hover:text-slate-700 font-medium">View all notifications</button>
                  </div>
                </div>
              )}
            </div>
            
            {/* User Profile */}
            <div className="relative z-50">
              <button 
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className={cn(
                  "w-8 h-8 rounded-full border flex items-center justify-center overflow-hidden shadow-sm transition-all",
                  isProfileOpen ? "ring-2 ring-indigo-500/20 border-indigo-500 bg-indigo-50" : "border-indigo-200 bg-indigo-100 hover:border-indigo-300"
                )}
              >
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-800">Felix Doe</p>
                    <p className="text-xs text-slate-500 mt-0.5">felix@skillsync.com</p>
                  </div>
                  <div className="py-1">
                    <NavLink to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                      <User className="w-4 h-4" /> My Profile
                    </NavLink>
                    <NavLink to="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
                      <Settings className="w-4 h-4" /> Account Settings
                    </NavLink>
                  </div>
                  <div className="py-1 border-t border-slate-100">
                    <button onClick={() => setIsProfileOpen(false)} className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 z-0 relative">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
