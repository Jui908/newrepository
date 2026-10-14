export type WordType = 'Danh từ' | 'Động từ' | 'Tính từ' | 'Phó từ' | 'Cụm từ' | 'Liên từ';

export type WordLevel = 'Sơ cấp 1' | 'Sơ cấp 2' | 'Trung cấp' | 'TOPIK I' | 'TOPIK II';

export interface Word {
  id: string;
  korean: string;
  vietnamese: string;
  hanja?: string;
  wordType: WordType;
  romaja: string;
  ipa?: string;
  exampleKorean: string;
  exampleVietnamese: string;
  level: WordLevel;
  topicId: string;
  imageUrl?: string;
  notes?: string;
}

export interface Topic {
  id: string;
  name: string;
  nameKorean: string;
  icon: string;
  description: string;
  badgeColor: string;
  bgGradient: string;
  wordCount: number;
}

export type ReviewRating = 'hard' | 'good' | 'easy';

export interface FlashcardItem {
  wordId: string;
  box: number; // 1 to 5
  nextReviewDate: number; // timestamp
  lastReviewedDate?: number;
  intervalDays: number;
  repetitions: number;
  status: 'new' | 'learning' | 'review' | 'mastered';
}

export interface CustomNotebook {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  createdAt: number;
  wordIds: string[];
}

export type QuestionType = 'multiple-choice' | 'audio-choice' | 'fill-blank' | 'match';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  koreanPrompt?: string;
  audioPrompt?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  level: string;
}

export interface RoadmapLesson {
  id: string;
  lessonNumber: number;
  stage: number;
  stageTitle: string;
  title: string;
  koreanTitle: string;
  description: string;
  grammarPoint?: string;
  wordIds: string[];
  exercises: QuizQuestion[];
  isComprehensiveTest?: boolean; // Every 3 lessons has a comprehensive review test!
}

export interface GrammarErrorItem {
  targetText: string;
  issueType: string;
  explanation: string;
  replacement: string;
}

export interface GrammarCheckResult {
  isCorrect: boolean;
  original: string;
  suggestedFix: string;
  vietnameseTranslation: string;
  overallExplanation: string;
  errors: GrammarErrorItem[];
  grammarBreakdown?: Array<{
    part: string;
    type: string;
    note: string;
  }>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: string;
  targetGoal: string; // 'Học từ đầu (Sơ cấp 1)' | 'Luyện thi TOPIK I' | 'Luyện thi TOPIK II' | 'Giao tiếp hàng ngày'
  hasCompletedOnboarding: boolean;
  dailyGoal: number; // e.g. 10 words
  streakDays: number;
  wordsLearned: number;
  totalTestsTaken: number;
  averageScore: number;
  completedLessonIds: string[];
}

export interface ErrorReport {
  id: string;
  wordId?: string;
  wordKorean?: string;
  errorType: 'mistranslation' | 'audio_error' | 'typo' | 'example_error' | 'other';
  description: string;
  reporterEmail?: string;
  createdAt: number;
  status: 'pending' | 'received';
}
