/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Word, UserProfile } from './types';
import { getUserProfile, saveUserProfile } from './utils/storage';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { SearchBar } from './components/home/SearchBar';
import { TopicVocabSection } from './components/home/TopicVocabSection';
import { FlashcardReview } from './components/flashcards/FlashcardReview';
import { MockTestView } from './components/tests/MockTestView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { NotebooksView } from './components/notebooks/NotebooksView';
import { SaveToNotebookModal } from './components/notebooks/SaveToNotebookModal';
import { ErrorReportModal } from './components/reports/ErrorReportModal';
import { AuthModal } from './components/profile/AuthModal';
import { ProfileModal } from './components/profile/ProfileModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    'home' | 'review' | 'tests' | 'roadmap' | 'notebooks'
  >('home');
  const [user, setUser] = useState<UserProfile | null>(null);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  // Active word targets for modals or custom reviews
  const [targetWordForSave, setTargetWordForSave] = useState<Word | null>(null);
  const [targetWordForReport, setTargetWordForReport] = useState<Word | null>(null);
  const [activeReviewWords, setActiveReviewWords] = useState<Word[] | undefined>(undefined);
  const [activeReviewTopicId, setActiveReviewTopicId] = useState<string | undefined>(undefined);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadedUser = getUserProfile();
    setUser(loadedUser);
    if (!loadedUser.hasCompletedOnboarding) {
      setOnboardingModalOpen(true);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleOpenSaveModal = (word: Word) => {
    setTargetWordForSave(word);
    setSaveModalOpen(true);
  };

  const handleOpenReportModal = (word?: Word) => {
    setTargetWordForReport(word || null);
    setReportModalOpen(true);
  };

  const handleStartTopicReview = (topicId: string) => {
    setActiveReviewTopicId(topicId);
    setActiveReviewWords(undefined);
    setCurrentTab('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartCustomWordsReview = (words: Word[]) => {
    setActiveReviewWords(words);
    setActiveReviewTopicId(undefined);
    setCurrentTab('review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteLesson = (lessonId: string) => {
    if (!user) return;
    if (!user.completedLessonIds.includes(lessonId)) {
      const updated: UserProfile = {
        ...user,
        completedLessonIds: [...user.completedLessonIds, lessonId],
        wordsLearned: user.wordsLearned + 5,
      };
      setUser(updated);
      saveUserProfile(updated);
      showToast('🎉 Chúc mừng! Bạn đã hoàn thành xuất sắc bài học!');
    }
  };

  const handleTestCompleted = (score: number, examTitle: string) => {
    if (!user) return;
    const newTotal = user.totalTestsTaken + 1;
    const newAverage = Math.round(
      (user.averageScore * user.totalTestsTaken + score) / newTotal
    );
    const updated: UserProfile = {
      ...user,
      totalTestsTaken: newTotal,
      averageScore: newAverage,
      wordsLearned: user.wordsLearned + 4,
    };
    setUser(updated);
    saveUserProfile(updated);
    showToast(`Đã lưu kết quả thi "${examTitle}": ${score}% điểm`);
  };

  const handleOnboardingComplete = (updatedProfile: Partial<UserProfile>) => {
    if (!user) return;
    const full: UserProfile = {
      ...user,
      ...updatedProfile,
      hasCompletedOnboarding: true,
    };
    setUser(full);
    saveUserProfile(full);
    setOnboardingModalOpen(false);
    showToast('Lộ trình cá nhân hóa của bạn đã sẵn sàng!');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2D2A26] flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenReport={() => handleOpenReportModal()}
        onOpenOnboarding={() => setOnboardingModalOpen(true)}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-stone-700 text-xs font-bold animate-in fade-in slide-in-from-bottom-4 flex items-center gap-2">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {currentTab === 'home' && (
          <div className="space-y-14">
            <SearchBar
              onSaveWordToNotebook={handleOpenSaveModal}
              onOpenReportError={handleOpenReportModal}
            />

            <TopicVocabSection
              onSaveWordToNotebook={handleOpenSaveModal}
              onStartTopicReview={handleStartTopicReview}
            />
          </div>
        )}

        {currentTab === 'review' && (
          <FlashcardReview
            initialTopicId={activeReviewTopicId}
            initialWordList={activeReviewWords}
            onSaveToNotebook={handleOpenSaveModal}
            onOpenReportError={handleOpenReportModal}
          />
        )}

        {currentTab === 'tests' && (
          <MockTestView onTestCompleted={handleTestCompleted} />
        )}

        {currentTab === 'roadmap' && (
          <RoadmapView
            completedLessonIds={user?.completedLessonIds || []}
            onCompleteLesson={handleCompleteLesson}
          />
        )}

        {currentTab === 'notebooks' && (
          <NotebooksView
            onStartFlashcardReview={handleStartCustomWordsReview}
            onOpenSaveModal={handleOpenSaveModal}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenReport={() => handleOpenReportModal()}
        onOpenRoadmap={() => {
          setCurrentTab('roadmap');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenReview={() => {
          setCurrentTab('review');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modals */}
      <SaveToNotebookModal
        word={targetWordForSave}
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onUpdated={() => showToast('Đã cập nhật danh sách từ trong sổ tay!')}
      />

      <ErrorReportModal
        word={targetWordForReport}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          saveUserProfile(loggedUser);
          showToast(`Chào mừng ${loggedUser.name} đã quay trở lại!`);
        }}
      />

      {user && (
        <ProfileModal
          user={user}
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          onUpdate={(updated) => {
            setUser(updated);
            saveUserProfile(updated);
            showToast('Đã cập nhật thông tin cá nhân!');
          }}
          onLogout={() => {
            setUser(null);
            setProfileModalOpen(false);
            showToast('Đã đăng xuất.');
          }}
        />
      )}

      <OnboardingModal
        isOpen={onboardingModalOpen}
        onComplete={handleOnboardingComplete}
        onClose={() => setOnboardingModalOpen(false)}
      />
    </div>
  );
}
