import React, { useState, useEffect } from 'react';
import { COURSES_DATA } from './data/coursesData';
import { Course, UserProgress } from './types';
import { Navbar } from './components/Navbar';
import { CourseCard } from './components/CourseCard';
import { LessonViewer } from './components/LessonViewer';
import { DashboardView } from './components/DashboardView';
import { CodePlayground } from './components/CodePlayground';
import { VercelFixModal } from './components/VercelFixModal';
import { CertificateModal } from './components/CertificateModal';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Award, 
  Terminal, 
  AlertCircle,
  Wrench,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

const STORAGE_KEY = 'training_site_progress_v1';

export default function App() {
  // Load saved progress from localStorage
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      // ignore
    }
    return {
      completedLessonIds: ['lesson-react-1'], // Seed 1 completed lesson for immediate feedback
      quizScores: {},
      notes: {},
      bookmarks: [],
      certificates: [],
      activeCourseId: null,
      activeLessonId: null,
      userName: 'Muhammad Ali', // Pre-populated from user's GitHub / Vercel username
    };
  });

  const [activeTab, setActiveTab] = useState<'courses' | 'dashboard' | 'playground'>('courses');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(progress.activeCourseId);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(progress.activeLessonId);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);
  const [certificateCourseId, setCertificateCourseId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');

  // Sync state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      // ignore
    }
  }, [progress]);

  // Compute total lessons in curriculum
  let totalCurriculumLessons = 0;
  COURSES_DATA.forEach(c => {
    c.modules.forEach(m => {
      totalCurriculumLessons += m.lessons.length;
    });
  });

  // Filtered courses
  const filteredCourses = COURSES_DATA.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.skillsLearned.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Handlers
  const handleSelectCourse = (courseId: string) => {
    const course = COURSES_DATA.find(c => c.id === courseId);
    if (!course) return;

    setSelectedCourseId(courseId);
    // Select first lesson or first uncompleted lesson
    const allLessonIds: string[] = [];
    course.modules.forEach(m => m.lessons.forEach(l => allLessonIds.push(l.id)));
    const firstUncompleted = allLessonIds.find(id => !progress.completedLessonIds.includes(id)) || allLessonIds[0];

    setSelectedLessonId(firstUncompleted);
    setProgress(prev => ({
      ...prev,
      activeCourseId: courseId,
      activeLessonId: firstUncompleted
    }));
  };

  const handleSelectLessonFromViewer = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setProgress(prev => ({
      ...prev,
      activeLessonId: lessonId
    }));
  };

  const handleToggleComplete = (lessonId: string) => {
    setProgress(prev => {
      const exists = prev.completedLessonIds.includes(lessonId);
      const updated = exists
        ? prev.completedLessonIds.filter(id => id !== lessonId)
        : [...prev.completedLessonIds, lessonId];
      return { ...prev, completedLessonIds: updated };
    });
  };

  const handleToggleBookmark = (lessonId: string) => {
    setProgress(prev => {
      const exists = prev.bookmarks.includes(lessonId);
      const updated = exists
        ? prev.bookmarks.filter(id => id !== lessonId)
        : [...prev.bookmarks, lessonId];
      return { ...prev, bookmarks: updated };
    });
  };

  const handleSaveNote = (lessonId: string, note: string) => {
    setProgress(prev => ({
      ...prev,
      notes: { ...prev.notes, [lessonId]: note }
    }));
  };

  const handleSaveQuizScore = (lessonId: string, score: number) => {
    setProgress(prev => ({
      ...prev,
      quizScores: { ...prev.quizScores, [lessonId]: score }
    }));
  };

  const handleUpdateUserName = (newName: string) => {
    setProgress(prev => ({
      ...prev,
      userName: newName
    }));
  };

  const handleOpenCertificate = (courseId: string) => {
    setCertificateCourseId(courseId);
  };

  const activeCourse = COURSES_DATA.find(c => c.id === selectedCourseId);
  const certCourse = COURSES_DATA.find(c => c.id === certificateCourseId);

  const categories = ['All', 'Web Development', 'Cloud & DevOps', 'AI & Machine Learning', 'Cybersecurity'];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Notification Banner about Vercel Issue Resolution */}
      <aside aria-label="Build status" className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border-b border-emerald-800/40 px-4 py-2 text-xs flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">
              <strong className="text-emerald-300 font-semibold">Vercel Deployment Alert:</strong> Fixed <code className="text-amber-300 font-mono">npm ERESOLVE esbuild@0.25.0</code> peer conflict by updating dependencies and configuring <code className="text-indigo-300 font-mono">.npmrc</code>.
            </span>
          </div>

          <button
            onClick={() => setIsVercelModalOpen(true)}
            className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5" />
            View Fix Instructions
          </button>
        </div>
      </aside>

      {/* Main Navbar */}
      <Navbar
        currentTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'courses') {
            setSelectedCourseId(null);
          }
        }}
        onOpenVercelFix={() => setIsVercelModalOpen(true)}
        completedCount={progress.completedLessonIds.length}
        totalLessons={totalCurriculumLessons}
        certificatesCount={progress.certificates.length}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {/* If inside a course lesson viewer */}
        {selectedCourseId && activeCourse && selectedLessonId ? (
          <LessonViewer
            course={activeCourse}
            currentLessonId={selectedLessonId}
            onSelectLesson={handleSelectLessonFromViewer}
            onBackToCourses={() => setSelectedCourseId(null)}
            completedLessonIds={progress.completedLessonIds}
            onToggleComplete={handleToggleComplete}
            bookmarks={progress.bookmarks}
            onToggleBookmark={handleToggleBookmark}
            notes={progress.notes}
            onSaveNote={handleSaveNote}
            quizScores={progress.quizScores}
            onSaveQuizScore={handleSaveQuizScore}
            onViewCertificate={handleOpenCertificate}
          />
        ) : activeTab === 'dashboard' ? (
          <DashboardView
            courses={COURSES_DATA}
            completedLessonIds={progress.completedLessonIds}
            bookmarks={progress.bookmarks}
            userName={progress.userName}
            onSelectCourse={handleSelectCourse}
            onSelectLesson={(courseId, lessonId) => {
              setSelectedCourseId(courseId);
              setSelectedLessonId(lessonId);
            }}
            onViewCertificate={handleOpenCertificate}
            onOpenVercelFix={() => setIsVercelModalOpen(true)}
          />
        ) : activeTab === 'playground' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-white">Interactive Code Sandbox</h1>
              <p className="text-xs text-slate-400">
                Write, test, and execute JavaScript or algorithm scripts with instant console evaluations.
              </p>
            </div>
            <div className="h-[620px]">
              <CodePlayground />
            </div>
          </div>
        ) : (
          /* Course Catalog / Curriculum Explorer */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Engineering Academy</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Architectural Training for <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent">Senior Engineers</span>
              </h1>

              <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Step beyond syntax tutorials. Master resilient React pipelines, multi-stage cloud CI/CD, applied LLM embeddings, and hardened cybersecurity architectures.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search input */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tracks, topics, or skills..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Category selector */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                        selectedCategory === cat
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Level selector */}
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {levels.map(lvl => (
                    <option key={lvl} value={lvl}>Level: {lvl}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredCourses.map((course) => {
                let courseTotal = 0;
                let courseCompleted = 0;
                course.modules.forEach(m => {
                  m.lessons.forEach(l => {
                    courseTotal++;
                    if (progress.completedLessonIds.includes(l.id)) {
                      courseCompleted++;
                    }
                  });
                });

                return (
                  <CourseCard
                    key={course.id}
                    course={course}
                    completedLessonsInCourse={courseCompleted}
                    totalLessonsInCourse={courseTotal}
                    onSelectCourse={handleSelectCourse}
                    onViewCertificate={handleOpenCertificate}
                  />
                );
              })}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800/60 p-8">
                <p className="text-slate-400 text-xs">No learning tracks match your filters.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedLevel('All'); }}
                  className="mt-3 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-slate-950 border-t border-slate-900 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">TrainingSite</span>
            <span>&bull;</span>
            <span>Engineering Education & Certification</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsVercelModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Vercel Build Fix Guide</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Vercel Error Fix Modal */}
      <VercelFixModal
        isOpen={isVercelModalOpen}
        onClose={() => setIsVercelModalOpen(false)}
      />

      {/* Certificate Modal */}
      {certificateCourseId && certCourse && (
        <CertificateModal
          course={certCourse}
          userName={progress.userName}
          onUpdateUserName={handleUpdateUserName}
          onClose={() => setCertificateCourseId(null)}
        />
      )}
    </div>
  );
}
