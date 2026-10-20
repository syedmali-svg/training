import React from 'react';
import { Course } from '../types';
import { 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Bookmark, 
  Flame, 
  Clock, 
  ArrowRight, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Code2
} from 'lucide-react';

interface DashboardViewProps {
  courses: Course[];
  completedLessonIds: string[];
  bookmarks: string[];
  userName: string;
  onSelectCourse: (courseId: string) => void;
  onSelectLesson: (courseId: string, lessonId: string) => void;
  onViewCertificate: (courseId: string) => void;
  onOpenVercelFix: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  courses,
  completedLessonIds,
  bookmarks,
  userName,
  onSelectCourse,
  onSelectLesson,
  onViewCertificate,
  onOpenVercelFix
}) => {
  // Compute global statistics
  let totalLessons = 0;
  courses.forEach(c => {
    c.modules.forEach(m => {
      totalLessons += m.lessons.length;
    });
  });

  const completedCount = completedLessonIds.length;
  const globalPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Completed courses
  const completedCourses = courses.filter(c => {
    const courseLessonIds: string[] = [];
    c.modules.forEach(m => m.lessons.forEach(l => courseLessonIds.push(l.id)));
    return courseLessonIds.length > 0 && courseLessonIds.every(id => completedLessonIds.includes(id));
  });

  // Bookmarked lessons resolution
  const bookmarkedLessonItems: { course: Course; lessonId: string; lessonTitle: string }[] = [];
  courses.forEach(c => {
    c.modules.forEach(m => {
      m.lessons.forEach(l => {
        if (bookmarks.includes(l.id)) {
          bookmarkedLessonItems.push({
            course: c,
            lessonId: l.id,
            lessonTitle: l.title
          });
        }
      });
    });
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Stats Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-indigo-900/40 p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Learner Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {userName || 'Engineer'}
            </h1>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Track your certifications, resume ongoing coursework, and review practical code exercises.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenVercelFix}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Vercel Build Fix Guide</span>
            </button>
          </div>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Completed Lessons</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white">
              {completedCount} <span className="text-xs text-slate-500 font-normal">/ {totalLessons}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Curriculum Mastery</span>
              <BookOpen className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold text-indigo-300">
              {globalPercent}%
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Certificates Earned</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-300">
              {completedCourses.length}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Study Streak</span>
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-orange-300">
              4 Days
            </div>
          </div>
        </div>
      </div>

      {/* 2 Grid: In Progress Courses + Bookmarked lessons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Your Learning Tracks */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Active Learning Tracks
            </h3>
          </div>

          <div className="space-y-3">
            {courses.map(course => {
              let courseTotal = 0;
              let courseCompleted = 0;
              course.modules.forEach(m => {
                m.lessons.forEach(l => {
                  courseTotal++;
                  if (completedLessonIds.includes(l.id)) {
                    courseCompleted++;
                  }
                });
              });
              const percent = courseTotal > 0 ? Math.round((courseCompleted / courseTotal) * 100) : 0;
              const isFinished = percent === 100;

              return (
                <div
                  key={course.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700 transition"
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {course.category}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {course.level}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white truncate">
                      {course.title}
                    </h4>

                    {/* Progress bar */}
                    <div className="w-full max-w-md flex items-center gap-3 pt-1">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isFinished ? 'bg-emerald-500' : 'bg-indigo-500'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-slate-400 shrink-0">
                        {courseCompleted}/{courseTotal} ({percent}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isFinished ? (
                      <button
                        onClick={() => onViewCertificate(course.id)}
                        className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <Award className="w-3.5 h-3.5" />
                        Certificate
                      </button>
                    ) : (
                      <button
                        onClick={() => onSelectCourse(course.id)}
                        className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                      >
                        <span>{percent > 0 ? 'Resume' : 'Start'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Bookmarks & Quick Access */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-400" />
            Bookmarked Lessons
          </h3>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            {bookmarkedLessonItems.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center italic">
                No bookmarked lessons yet. Click the bookmark icon in any lesson to pin it here!
              </p>
            ) : (
              <div className="space-y-2">
                {bookmarkedLessonItems.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSelectLesson(item.course.id, item.lessonId)}
                    className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 cursor-pointer transition flex items-center justify-between gap-3 text-xs group"
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-500 truncate">{item.course.title}</p>
                      <p className="font-medium text-slate-200 group-hover:text-indigo-300 transition truncate">
                        {item.lessonTitle}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 shrink-0 transition" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Sandbox Teaser */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-900/30 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
              <Code2 className="w-4 h-4" />
              <span>Interactive Code Sandbox</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Experiment with JavaScript logic, data transformations, and algorithm challenges in an isolated browser runner.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
