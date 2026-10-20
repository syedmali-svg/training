import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  LayoutDashboard, 
  Code2, 
  Wrench, 
  Award,
  Sparkles 
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'courses' | 'dashboard' | 'playground';
  onSelectTab: (tab: 'courses' | 'dashboard' | 'playground') => void;
  onOpenVercelFix: () => void;
  completedCount: number;
  totalLessons: number;
  certificatesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenVercelFix,
  completedCount,
  totalLessons,
  certificatesCount,
}) => {
  const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <div 
            onClick={() => onSelectTab('courses')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-indigo-200 transition">
                  TrainingSite
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Engineering Academy</p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('courses')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition ${
                currentTab === 'courses'
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Curriculum & Tracks
            </button>
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition ${
                currentTab === 'dashboard'
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              My Progress
              {certificatesCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded-full font-bold">
                  {certificatesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onSelectTab('playground')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg flex items-center gap-2 transition ${
                currentTab === 'playground'
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Code2 className="w-4 h-4" />
              Code Sandbox
            </button>
          </nav>
        </div>

        {/* Right Action & Diagnostics */}
        <div className="flex items-center gap-3">
          {/* Vercel Error Fix Badge/Button */}
          <button
            onClick={onOpenVercelFix}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition shadow-sm"
            title="Inspect Vercel build conflict resolution"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Vercel Build Fix</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-500/20 rounded text-emerald-200">
              Resolved
            </span>
          </button>

          {/* Quick Progress Indicator */}
          <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400">Progress:</span>
            <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="font-semibold text-indigo-300 text-[11px]">{percent}%</span>
          </div>
        </div>
      </div>
    </header>
  );
};
