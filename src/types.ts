export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type LessonType = 'concept' | 'interactive-code' | 'quiz' | 'case-study';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface CodeExercise {
  language: 'javascript' | 'typescript' | 'html' | 'json';
  instructions: string;
  starterCode: string;
  solutionCode: string;
  expectedOutputHint: string;
  tests?: {
    description: string;
    validate: (code: string) => boolean;
  }[];
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  durationMinutes: number;
  summary: string;
  sections?: {
    heading: string;
    content: string;
    codeSnippet?: {
      language: string;
      code: string;
      caption?: string;
    };
    callout?: {
      type: 'tip' | 'warning' | 'info' | 'key-takeaway';
      text: string;
    };
  }[];
  quiz?: QuizQuestion[];
  codeExercise?: CodeExercise;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: 'Web Development' | 'Cloud & DevOps' | 'AI & Machine Learning' | 'Cybersecurity' | 'Software Engineering';
  level: CourseLevel;
  durationHours: number;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  rating: number;
  enrolledCount: number;
  accentColor: string;
  iconName: string;
  prerequisites: string[];
  skillsLearned: string[];
  modules: Module[];
}

export interface CertificateRecord {
  courseId: string;
  courseTitle: string;
  recipientName: string;
  issuedDate: string;
  credentialId: string;
  grade: string;
}

export interface UserProgress {
  completedLessonIds: string[];
  quizScores: Record<string, number>; // lessonId -> percentage score
  notes: Record<string, string>; // lessonId -> note string
  bookmarks: string[]; // lessonIds
  certificates: CertificateRecord[];
  activeCourseId: string | null;
  activeLessonId: string | null;
  userName: string;
}
