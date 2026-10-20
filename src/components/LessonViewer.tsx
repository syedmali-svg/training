import React, { useState } from 'react';
import { 
  Course, 
  Lesson, 
  LessonType 
} from '../types';
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronLeft, 
  Bookmark, 
  BookmarkCheck, 
  FileText, 
  Code2, 
  HelpCircle, 
  Clock, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  AlertTriangle, 
  Lightbulb, 
  Info, 
  Award,
  Sparkles,
  Save
} from 'lucide-react';
import { CodePlayground } from './CodePlayground';
import { QuizRunner } from './QuizRunner';

interface LessonViewerProps {
  course: Course;
  currentLessonId: string;
  onSelectLesson: (lessonId: string) => void;
  onBackToCourses: () => void;
  completedLessonIds: string[];
  onToggleComplete: (lessonId: string) => void;
  bookmarks: string[];
  onToggleBookmark: (lessonId: string) => void;
  notes: Record<string, string>;
  onSaveNote: (lessonId: string, note: string) => void;
  quizScores: Record<string, number>;
  onSaveQuizScore: (lessonId: string, score: number) => void;
  onViewCertificate: (courseId: string) => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  course,
  currentLessonId,
  onSelectLesson,
  onBackToCourses,
  completedLessonIds,
  onToggleComplete,
  bookmarks,
  onToggleBookmark,
  notes,
  onSaveNote,
  quizScores,
  onSaveQuizScore,
  onViewCertificate,
}) => {
  // Find current lesson and module
  let currentLesson: Lesson | undefined;
  let currentModuleTitle = '';
  const allLessons: { lesson: Lesson; moduleTitle: string }[] = [];

  for (const mod of course.modules) {
    for (const l of mod.lessons) {
      allLessons.push({ lesson: l, moduleTitle: mod.title });
      if (l.id === currentLessonId) {
        currentLesson = l;
        currentModuleTitle = mod.title;
      }
    }
  }

  // Fallback to first lesson if not found
  if (!currentLesson && allLessons.length > 0) {
    currentLesson = allLessons[0].lesson;
    currentModuleTitle = allLessons[0].moduleTitle;
  }

  const currentIndex = allLessons.findIndex(x => x.lesson.id === currentLesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1].lesson : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1].lesson : null;

  const isCurrentCompleted = currentLesson ? completedLessonIds.includes(currentLesson.id) : false;
  const isBookmarked = currentLesson ? bookmarks.includes(currentLesson.id) : false;

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'content' | 'practice' | 'quiz' | 'notes'>('content');
  const [currentNote, setCurrentNote] = useState<string>(
    (currentLesson && notes[currentLesson.id]) || ''
  );
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Sync note text when changing lessons
  React.useEffect(() => {
    if (currentLesson) {
      setCurrentNote(notes[currentLesson.id] || '');
      // Auto select appropriate tab based on lesson type
      if (currentLesson.type === 'quiz') {
        setActiveTab('quiz');
      } else if (currentLesson.type === 'interactive-code') {
        setActiveTab('practice');
      } else {
        setActiveTab('content');
      }
    }
  }, [currentLesson?.id]);

  const handleSaveCurrentNote = () => {
    if (currentLesson) {
      onSaveNote(currentLesson.id, currentNote);
      setNoteSavedFeedback(true);
      setTimeout(() => setNoteSavedFeedback(false), 2000);
    }
  };

  const copyCodeSnippet = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(idx);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const toggleVoiceNarration = () => {
    if (!('speechSynthesis' in window)) return;
    if (isVoiceActive) {
      window.speechSynthesis.cancel();
      setIsVoiceActive(false);
    } else {
      if (!currentLesson) return;
      const textToRead = `${currentLesson.title}. ${currentLesson.summary}. ` + 
        (currentLesson.sections?.map(s => `${s.heading}. ${s.content}`).join('. ') || '');
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.onend = () => setIsVoiceActive(false);
      utterance.onerror = () => setIsVoiceActive(false);
      window.speechSynthesis.speak(utterance);
      setIsVoiceActive(true);
    }
  };

  if (!currentLesson) return null;

  const totalCourseLessons = allLessons.length;
  const completedInCourse = allLessons.filter(l => completedLessonIds.includes(l.lesson.id)).length;
  const coursePercent = Math.round((completedInCourse / totalCourseLessons) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Bar / Navigation Back */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCourses}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Courses</span>
          </button>

          <div className="text-xs">
            <span className="text-slate-500">{course.title}</span>
            <span className="text-slate-600 mx-2">&gt;</span>
            <span className="text-indigo-400 font-medium">{currentModuleTitle}</span>
          </div>
        </div>

        {/* Course progress overview */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[11px] text-slate-400 block">Course Completion</span>
            <span className="text-xs font-bold text-slate-200">
              {completedInCourse}/{totalCourseLessons} ({coursePercent}%)
            </span>
          </div>

          {coursePercent === 100 && (
            <button
              onClick={() => onViewCertificate(course.id)}
              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Award className="w-3.5 h-3.5" />
              Claim Certificate
            </button>
          )}
        </div>
      </div>

      {/* Main 2-column layout: Sidebar Curriculum + Lesson Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Module & Lesson navigation */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Course Curriculum
            </h4>
            <span className="text-[11px] text-slate-400">
              {course.durationHours} hrs estimated
            </span>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {course.modules.map((mod, modIdx) => (
              <div key={mod.id} className="space-y-2">
                <div className="text-xs font-semibold text-slate-300 px-2 py-1 bg-slate-950/60 rounded-lg border border-slate-800/60 flex items-center justify-between">
                  <span>{mod.title}</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {mod.lessons.length} lessons
                  </span>
                </div>

                <div className="space-y-1 pl-1">
                  {mod.lessons.map((lesson) => {
                    const isSelected = lesson.id === currentLesson?.id;
                    const isCompleted = completedLessonIds.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson.id)}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between gap-3 transition ${
                          isSelected
                            ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/40 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                          )}
                          <span className="truncate font-medium">{lesson.title}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 text-[10px] text-slate-500">
                          {lesson.type === 'quiz' && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                              Quiz
                            </span>
                          )}
                          {lesson.type === 'interactive-code' && (
                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              Lab
                            </span>
                          )}
                          <span>{lesson.durationMinutes}m</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column: Lesson Content and Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {/* Lesson Header Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold uppercase tracking-wider text-[10px]">
                  {currentLesson.type}
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {currentLesson.durationMinutes} min read
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {/* Voice narration */}
                {'speechSynthesis' in window && (
                  <button
                    onClick={toggleVoiceNarration}
                    className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition ${
                      isVoiceActive
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title={isVoiceActive ? 'Stop reading' : 'Listen to lesson narration'}
                  >
                    {isVoiceActive ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4" />}
                    <span className="hidden sm:inline">{isVoiceActive ? 'Stop' : 'Listen'}</span>
                  </button>
                )}

                {/* Bookmark */}
                <button
                  onClick={() => onToggleBookmark(currentLesson.id)}
                  className={`p-2 rounded-xl border text-xs flex items-center gap-1.5 transition ${
                    isBookmarked
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark lesson'}
                >
                  {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>

                {/* Mark Complete */}
                <button
                  onClick={() => onToggleComplete(currentLesson.id)}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                    isCurrentCompleted
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isCurrentCompleted ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <span>{isCurrentCompleted ? 'Completed' : 'Mark Complete'}</span>
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {currentLesson.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {currentLesson.summary}
              </p>
            </div>

            {/* Sub Tabs Selector */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setActiveTab('content')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'content'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Lesson Content
              </button>

              {currentLesson.codeExercise && (
                <button
                  onClick={() => setActiveTab('practice')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    activeTab === 'practice'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Code Lab
                </button>
              )}

              {currentLesson.quiz && (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                    activeTab === 'quiz'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Quiz Check
                </button>
              )}

              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'notes'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                My Notes
                {currentNote.trim() && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
              </button>
            </div>
          </div>

          {/* Active Tab Body */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              {currentLesson.sections?.map((section, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4"
                >
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {section.heading}
                  </h3>
                  <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>

                  {/* Code snippet with copy button */}
                  {section.codeSnippet && (
                    <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                      <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs">
                        <span className="font-mono text-slate-400 text-[11px]">
                          {section.codeSnippet.caption || section.codeSnippet.language}
                        </span>
                        <button
                          onClick={() => copyCodeSnippet(section.codeSnippet!.code, idx)}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 flex items-center gap-1 text-[11px] transition"
                        >
                          {copiedCodeIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-4 text-xs font-mono text-indigo-300 overflow-x-auto leading-relaxed">
                        <code>{section.codeSnippet.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Callouts: Tip / Warning / Key Takeaway */}
                  {section.callout && (
                    <div
                      className={`p-4 rounded-xl border text-xs space-y-1 ${
                        section.callout.type === 'tip'
                          ? 'bg-cyan-950/20 border-cyan-800/40 text-cyan-300'
                          : section.callout.type === 'warning'
                          ? 'bg-amber-950/20 border-amber-800/40 text-amber-300'
                          : 'bg-indigo-950/20 border-indigo-800/40 text-indigo-300'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                        {section.callout.type === 'tip' && <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />}
                        {section.callout.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                        {section.callout.type === 'key-takeaway' && <Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
                        {section.callout.type.replace('-', ' ')}
                      </div>
                      <p className="text-slate-200 leading-relaxed">
                        {section.callout.text}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'practice' && currentLesson.codeExercise && (
            <div className="h-[520px]">
              <CodePlayground
                exercise={currentLesson.codeExercise}
                onExerciseComplete={() => onToggleComplete(currentLesson.id)}
              />
            </div>
          )}

          {activeTab === 'quiz' && currentLesson.quiz && (
            <QuizRunner
              questions={currentLesson.quiz}
              previousScore={quizScores[currentLesson.id]}
              onCompleteQuiz={(score) => {
                onSaveQuizScore(currentLesson.id, score);
                if (score >= 70) {
                  onToggleComplete(currentLesson.id);
                }
              }}
            />
          )}

          {activeTab === 'notes' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Lesson Notes</h3>
                  <p className="text-xs text-slate-400">
                    Jot down thoughts, command reminders, or questions. Automatically saved locally.
                  </p>
                </div>
                <button
                  onClick={handleSaveCurrentNote}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  {noteSavedFeedback ? 'Saved!' : 'Save Note'}
                </button>
              </div>

              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Write your study notes for this lesson here..."
                rows={10}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-600 resize-none font-sans"
              />
            </div>
          )}

          {/* Bottom Previous / Next buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            {prevLesson ? (
              <button
                onClick={() => onSelectLesson(prevLesson.id)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous: {prevLesson.title}</span>
              </button>
            ) : <div />}

            {nextLesson ? (
              <button
                onClick={() => onSelectLesson(nextLesson.id)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-md shadow-indigo-600/20"
              >
                <span>Next: {nextLesson.title}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => onViewCertificate(course.id)}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition shadow-md shadow-emerald-600/20"
              >
                <Award className="w-4 h-4" />
                <span>Finish Course & Claim Certificate</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
