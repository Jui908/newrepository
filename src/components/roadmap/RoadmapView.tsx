import React, { useState } from 'react';
import { ROADMAP_STAGES } from '../../data/roadmap';
import { RoadmapLesson, Word } from '../../types';
import { INITIAL_WORDS } from '../../data/vocabulary';
import { playKoreanAudio } from '../../utils/audio';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  ChevronRight,
  Volume2,
  Play,
  Star,
  Layers,
} from 'lucide-react';

interface RoadmapViewProps {
  completedLessonIds: string[];
  onCompleteLesson: (lessonId: string) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  completedLessonIds,
  onCompleteLesson,
}) => {
  const [selectedLesson, setSelectedLesson] = useState<RoadmapLesson | null>(null);
  const [isTakingExercise, setIsTakingExercise] = useState(false);
  const [exerciseAnswers, setExerciseAnswers] = useState<Record<number, number>>({});
  const [exerciseSubmitted, setExerciseSubmitted] = useState(false);

  const handleOpenLesson = (lesson: RoadmapLesson) => {
    setSelectedLesson(lesson);
    setIsTakingExercise(false);
    setExerciseAnswers({});
    setExerciseSubmitted(false);
  };

  const handleSelectExerciseOption = (qIdx: number, optIdx: number) => {
    if (exerciseSubmitted) return;
    setExerciseAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const handleSubmitExercise = () => {
    if (!selectedLesson) return;
    setExerciseSubmitted(true);
    let correct = 0;
    selectedLesson.exercises.forEach((q, idx) => {
      if (exerciseAnswers[idx] === q.correctIndex) correct++;
    });

    if (correct >= Math.ceil(selectedLesson.exercises.length * 0.5)) {
      onCompleteLesson(selectedLesson.id);
    }
  };

  // Calculate overall roadmap progress
  const totalLessons = ROADMAP_STAGES.reduce((acc, st) => acc + st.lessons.length, 0);
  const finishedLessons = completedLessonIds.length;
  const progressPercent = Math.min(100, Math.round((finishedLessons / totalLessons) * 100));

  // Get words for selected lesson
  const wordsInLesson: Word[] = selectedLesson
    ? INITIAL_WORDS.filter((w) => selectedLesson.wordIds.includes(w.id))
    : [];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Lộ trình học tập từng bước cho người mới bắt đầu
          </div>
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">
            Tiến Độ Học Tập & Lộ Trình Thông Minh
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Thiết kế bài bản từ Bảng chữ cái Hangeul &rarr; Sơ cấp 1 &rarr; Sơ cấp 2 &rarr; Ôn thi TOPIK.
            Có bài tập củng cố sau mỗi bài và bài kiểm tra tổng hợp định kỳ 3 bài một lần.
          </p>
        </div>

        {/* Global Progress Bar */}
        <div className="bg-[#FFFDF9] p-5 rounded-3xl border border-stone-200/90 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-700">Tiến độ hoàn thành toàn bộ lộ trình:</span>
            <span className="font-black text-emerald-700">{progressPercent}%</span>
          </div>
          <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-400">
            Đã hoàn thành {finishedLessons} / {totalLessons} bài học & bài kiểm tra tổng hợp
          </p>
        </div>
      </div>

      {/* Stages & Lessons List */}
      <div className="space-y-6">
        {ROADMAP_STAGES.map((stage, stageIdx) => (
          <div
            key={stage.id}
            className="bg-[#FFFDF9] rounded-3xl border border-stone-200/90 shadow-sm p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 uppercase tracking-wider">
                  Giai đoạn {stageIdx + 1}
                </span>
                <h3 className="text-lg font-black text-stone-900 mt-1">{stage.title}</h3>
                <p className="text-xs text-stone-500">{stage.description}</p>
              </div>
            </div>

            <div className="space-y-3">
              {stage.lessons.map((lesson) => {
                const isCompleted = completedLessonIds.includes(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      lesson.isComprehensiveTest
                        ? 'border-amber-300 bg-amber-50/50 hover:bg-amber-50'
                        : isCompleted
                        ? 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70'
                        : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          lesson.isComprehensiveTest
                            ? 'bg-amber-500 text-white shadow-xs'
                            : isCompleted
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {lesson.isComprehensiveTest ? (
                          <Star className="w-5 h-5 fill-current" />
                        ) : isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <BookOpen className="w-5 h-5" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-stone-900">
                            {lesson.title}
                          </span>
                          {lesson.isComprehensiveTest && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                              Định kỳ 3 bài
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-emerald-800 font-semibold">
                          {lesson.koreanTitle}
                        </p>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {lesson.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenLesson(lesson)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 self-end sm:self-auto ${
                        lesson.isComprehensiveTest
                          ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                          : isCompleted
                          ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      }`}
                    >
                      {isCompleted ? 'Học lại / Ôn tập' : 'Vào bài học'}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Lesson Details Modal / View */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#FFFDF9] rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-100 bg-stone-50/70 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase">
                  {selectedLesson.koreanTitle}
                </span>
                <h3 className="text-xl font-black text-stone-900">
                  {selectedLesson.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLesson(null)}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-600"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {!isTakingExercise ? (
                <>
                  {/* Grammar & Core Concept */}
                  {selectedLesson.grammarPoint && (
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        Trọng tâm ngữ pháp & cấu trúc:
                      </span>
                      <p className="text-sm font-bold text-stone-800">
                        {selectedLesson.grammarPoint}
                      </p>
                    </div>
                  )}

                  {/* Vocabulary in this lesson */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      Từ vựng trọng tâm bài học ({wordsInLesson.length} từ):
                    </h4>

                    {wordsInLesson.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {wordsInLesson.map((v) => (
                          <div
                            key={v.id}
                            className="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between"
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-stone-900 text-sm">
                                  {v.korean}
                                </span>
                                <span className="text-[10px] text-stone-400 font-mono">
                                  [{v.romaja}]
                                </span>
                              </div>
                              <span className="text-xs text-stone-600 block">
                                {v.vietnamese}
                              </span>
                            </div>
                            <button
                              onClick={() => playKoreanAudio(v.korean, 1.0)}
                              className="p-1.5 rounded-lg bg-stone-100 hover:bg-emerald-100 text-stone-600 hover:text-emerald-700 transition-colors"
                              title="Nghe phát âm"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-500 italic">
                        Bài học ôn tập tổng hợp toàn diện các từ vựng đã học.
                      </p>
                    )}
                  </div>

                  {/* Button to proceed to exercise */}
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-500">
                      Bài tập củng cố: {selectedLesson.exercises.length} câu trắc nghiệm
                    </span>
                    <button
                      onClick={() => setIsTakingExercise(true)}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Làm bài tập củng cố ngay
                    </button>
                  </div>
                </>
              ) : (
                /* Interactive Exercise */
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase">
                        Bài tập củng cố kiến thức
                      </span>
                      <p className="text-xs text-stone-500">
                        Đạt từ 50% trở lên để hoàn thành bài học và mở khóa tiến độ
                      </p>
                    </div>
                    <button
                      onClick={() => setIsTakingExercise(false)}
                      className="text-xs text-stone-400 hover:text-stone-600"
                    >
                      &larr; Xem lại bài giảng
                    </button>
                  </div>

                  <div className="space-y-5">
                    {selectedLesson.exercises.map((q, qIdx) => {
                      const selectedOpt = exerciseAnswers[qIdx];
                      const isCorrect = exerciseSubmitted && selectedOpt === q.correctIndex;
                      const isWrong = exerciseSubmitted && selectedOpt !== undefined && !isCorrect;

                      return (
                        <div
                          key={q.id}
                          className="p-4 rounded-2xl bg-white border border-stone-200 space-y-3"
                        >
                          <p className="text-sm font-bold text-stone-900">
                            Câu {qIdx + 1}: {q.question}
                          </p>

                          <div className="space-y-2">
                            {q.options.map((opt, optIdx) => {
                              const isChoice = selectedOpt === optIdx;
                              const isThisCorrect = exerciseSubmitted && optIdx === q.correctIndex;

                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleSelectExerciseOption(qIdx, optIdx)}
                                  disabled={exerciseSubmitted}
                                  className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                                    exerciseSubmitted
                                      ? isThisCorrect
                                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                                        : isChoice
                                        ? 'border-rose-400 bg-rose-50 text-rose-800'
                                        : 'border-stone-200 opacity-60'
                                      : isChoice
                                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                                      : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {exerciseSubmitted && isThisCorrect && (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {exerciseSubmitted && (
                            <p className="text-[11px] text-stone-600 bg-stone-50 p-2.5 rounded-lg border border-stone-100">
                              💡 <strong>Giải thích:</strong> {q.explanation}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    {!exerciseSubmitted ? (
                      <button
                        onClick={handleSubmitExercise}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        Nộp bài kiểm tra củng cố
                      </button>
                    ) : (
                      <div className="w-full flex items-center justify-between gap-3">
                        <button
                          onClick={() => {
                            setExerciseAnswers({});
                            setExerciseSubmitted(false);
                          }}
                          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl"
                        >
                          Làm lại
                        </button>
                        <button
                          onClick={() => setSelectedLesson(null)}
                          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                        >
                          Hoàn tất bài học
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
