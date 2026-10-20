import React from 'react';
import { Course } from '../types';
import { 
  Clock, 
  BookOpen, 
  Star, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Code2, 
  Server, 
  Cpu, 
  ShieldCheck,
  Award
} from 'lucide-react';

interface CourseCardProps {
  course: Course;
  completedLessonsInCourse: number;
  totalLessonsInCourse: number;
  onSelectCourse: (courseId: string) => void;
  onViewCertificate?: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  completedLessonsInCourse,
  totalLessonsInCourse,
  onSelectCourse,
  onViewCertificate
}) => {
  const percent = totalLessonsInCourse > 0 
    ? Math.round((completedLessonsInCourse / totalLessonsInCourse) * 100) 
    : 0;

  const isCompleted = percent === 100;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code':
        return <Code2 className="w-6 h-6 text-indigo-400" />;
      case 'Server':
        return <Server className="w-6 h-6 text-emerald-400" />;
      case 'Cpu':
        return <Cpu className="w-6 h-6 text-purple-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-rose-400" />;
      default:
        return <BookOpen className="w-6 h-6 text-cyan-400" />;
    }
  };

  const levelColor = {
    Beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    Intermediate: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    Advanced: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  }[course.level];

  return (
    <div className="flex flex-col bg-slate-900/90 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition duration-300 shadow-xl overflow-hidden group hover:shadow-indigo-500/5">
      {/* Top banner / icon header */}
      <div className="p-6 pb-4 border-b border-slate-800/50 relative">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner group-hover:scale-105 transition">
            {renderIcon(course.iconName)}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${levelColor}`}>
              {course.level}
            </span>
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-800 text-slate-300">
              {course.category}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
          {course.title}
        </h3>
        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {course.tagline}
        </p>

        {/* Quick meta stats */}
        <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{course.durationHours} hrs total</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>{totalLessonsInCourse} lessons</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-slate-200">{course.rating}</span>
          </div>
        </div>
      </div>

      {/* Middle section: Key Skills */}
      <div className="p-6 py-4 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Core Competencies
          </span>
          <div className="flex flex-wrap gap-1.5">
            {course.skillsLearned.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800/80"
              >
                {skill}
              </span>
            ))}
            {course.skillsLearned.length > 3 && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/50 text-slate-400">
                +{course.skillsLearned.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-800/50">
          <img
            src={course.instructor.avatar}
            alt={course.instructor.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-700"
          />
          <div className="text-xs">
            <p className="font-semibold text-slate-200">{course.instructor.name}</p>
            <p className="text-[11px] text-slate-500">{course.instructor.role}</p>
          </div>
        </div>
      </div>

      {/* Bottom CTA & Progress Bar */}
      <div className="p-6 pt-3 bg-slate-950/60 border-t border-slate-800/60">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-400 flex items-center gap-1.5">
            {isCompleted ? (
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Track Completed
              </span>
            ) : (
              <span>Progress</span>
            )}
          </span>
          <span className="font-semibold text-slate-300">
            {completedLessonsInCourse}/{totalLessonsInCourse} lessons ({percent}%)
          </span>
        </div>

        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isCompleted
                ? 'bg-emerald-500'
                : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
            }`}
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectCourse(course.id)}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
              isCompleted
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                : percent > 0
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
            }`}
          >
            <span>{isCompleted ? 'Review Track' : percent > 0 ? 'Continue Track' : 'Start Track'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {isCompleted && onViewCertificate && (
            <button
              onClick={() => onViewCertificate(course.id)}
              className="p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 transition"
              title="View Certificate of Completion"
            >
              <Award className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
