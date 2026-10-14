import { CustomNotebook, FlashcardItem, ReviewRating, UserProfile, ErrorReport } from '../types';

const STORAGE_KEYS = {
  FLASHCARDS: 'korean_vocab_flashcards',
  NOTEBOOKS: 'korean_vocab_notebooks',
  USER_PROFILE: 'korean_vocab_user_profile',
  SEARCH_HISTORY: 'korean_vocab_search_history',
  ERROR_REPORTS: 'korean_vocab_error_reports',
};

// Initial default notebooks
export const DEFAULT_NOTEBOOKS: CustomNotebook[] = [
  {
    id: 'nb-favorites',
    name: 'Từ vựng yêu thích',
    description: 'Các từ vựng hay dùng và muốn ghi nhớ lâu',
    color: '#10B981', // emerald
    icon: 'Bookmark',
    createdAt: Date.now(),
    wordIds: ['w-1', 'w-15', 'w-41', 'w-43'],
  },
  {
    id: 'nb-topik1-prep',
    name: 'Luyện thi TOPIK I',
    description: 'Các từ vựng cốt lõi thường gặp trong đề thi TOPIK',
    color: '#0284C7', // sky
    icon: 'Award',
    createdAt: Date.now(),
    wordIds: ['w-46', 'w-47', 'w-48', 'w-49', 'w-51', 'w-53'],
  },
  {
    id: 'nb-dining',
    name: 'Ăn uống & Đi ăn quán',
    description: 'Mẫu câu và từ vựng khi đi ăn nhà hàng tại Hàn Quốc',
    color: '#F59E0B', // amber
    icon: 'Utensils',
    createdAt: Date.now(),
    wordIds: ['w-13', 'w-14', 'w-15', 'w-16', 'w-17', 'w-18'],
  },
];

export const DEFAULT_USER: UserProfile = {
  id: 'user-default-1',
  name: 'Học viên K-Vocab',
  email: 'learner@koreanvocab.vn',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  level: 'Sơ cấp 1',
  targetGoal: 'Học từ đầu (Sơ cấp 1)',
  hasCompletedOnboarding: false,
  dailyGoal: 10,
  streakDays: 4,
  wordsLearned: 28,
  totalTestsTaken: 5,
  averageScore: 92,
  completedLessonIds: ['lesson-1', 'lesson-2'],
};

// --- FLASHCARD & SPACED REPETITION ---
export function getFlashcardData(): Record<string, FlashcardItem> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FLASHCARDS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveFlashcardRating(wordId: string, rating: ReviewRating): FlashcardItem {
  const allCards = getFlashcardData();
  const current = allCards[wordId] || {
    wordId,
    box: 1,
    nextReviewDate: Date.now(),
    intervalDays: 0,
    repetitions: 0,
    status: 'new',
  };

  const now = Date.now();
  let nextReviewDate = now;
  let newBox = current.box;
  let intervalDays = current.intervalDays;
  let status = current.status;

  if (rating === 'easy') {
    // Mastered / Easy -> jump 4 days (or exponentially)
    newBox = Math.min(5, current.box + 1);
    intervalDays = newBox === 1 ? 2 : Math.round(newBox * 2.5);
    nextReviewDate = now + intervalDays * 24 * 60 * 60 * 1000;
    status = newBox >= 3 ? 'mastered' : 'review';
  } else if (rating === 'good') {
    // Good -> 1 day interval
    newBox = Math.max(1, current.box);
    intervalDays = 1;
    nextReviewDate = now + 1 * 24 * 60 * 60 * 1000;
    status = 'review';
  } else {
    // Hard -> reset to 10 minutes
    newBox = 1;
    intervalDays = 0;
    nextReviewDate = now + 10 * 60 * 1000; // 10 minutes
    status = 'learning';
  }

  const updated: FlashcardItem = {
    wordId,
    box: newBox,
    nextReviewDate,
    lastReviewedDate: now,
    intervalDays,
    repetitions: current.repetitions + 1,
    status,
  };

  allCards[wordId] = updated;
  try {
    localStorage.setItem(STORAGE_KEYS.FLASHCARDS, JSON.stringify(allCards));
  } catch (e) {
    console.warn('Failed to save flashcard to localStorage:', e);
  }
  return updated;
}

// --- NOTEBOOKS ---
export function getCustomNotebooks(): CustomNotebook[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTEBOOKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTEBOOKS, JSON.stringify(DEFAULT_NOTEBOOKS));
      return DEFAULT_NOTEBOOKS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_NOTEBOOKS;
  }
}

export function saveCustomNotebooks(notebooks: CustomNotebook[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTEBOOKS, JSON.stringify(notebooks));
  } catch (e) {
    console.warn('Failed to save notebooks:', e);
  }
}

export function toggleWordInNotebook(notebookId: string, wordId: string): boolean {
  const notebooks = getCustomNotebooks();
  const target = notebooks.find((nb) => nb.id === notebookId);
  if (!target) return false;

  const exists = target.wordIds.includes(wordId);
  if (exists) {
    target.wordIds = target.wordIds.filter((id) => id !== wordId);
  } else {
    target.wordIds.push(wordId);
  }

  saveCustomNotebooks(notebooks);
  return !exists; // returns true if added, false if removed
}

// --- SEARCH HISTORY ---
export function getSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return raw ? JSON.parse(raw) : ['안녕하세요', 'cơm', '학교', 'thức dậy', 'TOPIK'];
  } catch {
    return ['안녕하세요', 'cơm', '학교'];
  }
}

export function addSearchHistory(query: string): string[] {
  const trimmed = query.trim();
  if (!trimmed) return getSearchHistory();
  const current = getSearchHistory().filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
  const updated = [trimmed, ...current].slice(0, 8);
  try {
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save search history:', e);
  }
  return updated;
}

export function clearSearchHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  } catch (e) {
    console.warn('Failed to clear search history:', e);
  }
}

// --- USER PROFILE ---
export function getUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_USER;
  }
}

export function saveUserProfile(user: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
  } catch (e) {
    console.warn('Failed to save user profile:', e);
  }
}

// --- ERROR REPORTS ---
export function getErrorReports(): ErrorReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ERROR_REPORTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function submitErrorReport(report: Omit<ErrorReport, 'id' | 'createdAt' | 'status'>): ErrorReport {
  const current = getErrorReports();
  const newReport: ErrorReport = {
    ...report,
    id: 'report-' + Date.now(),
    createdAt: Date.now(),
    status: 'pending',
  };
  const updated = [newReport, ...current];
  try {
    localStorage.setItem(STORAGE_KEYS.ERROR_REPORTS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save error report:', e);
  }
  return newReport;
}
