import React, { useState, useEffect } from 'react';
import { MOCK_EXAMS, MockExam } from '../../data/mockTests';
import { playKoreanAudio } from '../../utils/audio';
import {
  GraduationCap,
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Volume2,
  Award,
} from 'lucide-react';

interface MockTestViewProps {
  onTestCompleted?: (score: number, examTitle: string) => void;
}

export const MockTestView: React.FC<MockTestViewProps> = ({ onTestCompleted }) => {
  const [selectedExam, setSelectedExam] = useState<MockExam>(MOCK_EXAMS[0]);
  const [isTesting, setIsTesting] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(selectedExam.timeLimitMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTesting && !isSubmitted && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTesting, isSubmitted, timeLeftSeconds]);

  const handleStartExam = (exam: MockExam) => {
    setSelectedExam(exam);
    setIsTesting(true);
    setCurrentQuestionIdx(0);
    setAnswers({});
    setTimeLeftSeconds(exam.timeLimitMinutes * 60);
    setIsSubmitted(false);
  };

  const handleSelectOption = (optionIdx: number) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: optionIdx,
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // calculate score
    let correct = 0;
    selectedExam.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) correct++;
    });
    const percentage = Math.round((correct / selectedExam.questions.length) * 100);
    if (onTestCompleted) {
      onTestCompleted(percentage, selectedExam.title);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  // Score calculation
  const totalQuestions = selectedExam.questions.length;
  const correctCount = selectedExam.questions.filter((q, idx) => answers[idx] === q.correctIndex).length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const currentQ = selectedExam.questions[currentQuestionIdx];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      {!isTesting && (
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              Thi thử trực tuyến
            </div>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight">
              Phòng Thi Thử Năng Lực Tiếng Hàn
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Lựa chọn bài thi theo trình độ Sơ cấp 1, Sơ cấp 2, TOPIK I và TOPIK II để đánh giá phản xạ ghi nhớ từ vựng và ngữ pháp.
            </p>
          </div>

          {/* Exam Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_EXAMS.map((exam) => (
              <div
                key={exam.id}
                className="bg-[#FFFDF9] rounded-3xl border border-stone-200 p-6 space-y-4 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${exam.badgeColor}`}>
                      {exam.level}
                    </span>
                    <span className="text-xs font-semibold text-stone-400 flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5" />
                      {exam.timeLimitMinutes} phút
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-stone-900 leading-tight">
                    {exam.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700">
                    {exam.koreanTitle}
                  </p>
                  <p className="text-xs text-stone-500 leading-relaxed">
                    {exam.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-stone-400">
                    {exam.questions.length} câu hỏi trắc nghiệm
                  </span>
                  <button
                    onClick={() => handleStartExam(exam)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    Bắt đầu thi &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Taking Exam View */}
      {isTesting && (
        <div className="bg-[#FFFDF9] rounded-3xl border border-stone-200/90 shadow-md p-6 sm:p-8 space-y-6">
          {/* Top Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase">
                {selectedExam.level} &bull; {selectedExam.koreanTitle}
              </span>
              <h3 className="text-lg font-black text-stone-900 mt-0.5">
                {selectedExam.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {!isSubmitted ? (
                <div className="px-4 py-2 bg-stone-100 rounded-2xl flex items-center gap-2 border border-stone-200">
                  <Timer className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <span className="text-sm font-mono font-black text-stone-800">
                    {formatTime(timeLeftSeconds)}
                  </span>
                </div>
              ) : (
                <div className="px-4 py-2 bg-emerald-100 rounded-2xl flex items-center gap-2 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  <Award className="w-4 h-4" />
                  Đã hoàn thành bài thi
                </div>
              )}

              <button
                onClick={() => setIsTesting(false)}
                className="text-xs font-semibold text-stone-400 hover:text-stone-600"
              >
                Rời phòng thi
              </button>
            </div>
          </div>

          {/* Question Navigator Dots */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {selectedExam.questions.map((q, idx) => {
              const isAnswered = answers[idx] !== undefined;
              const isCurrent = idx === currentQuestionIdx;
              const isCorrect = isSubmitted && answers[idx] === q.correctIndex;
              const isWrong = isSubmitted && answers[idx] !== undefined && !isCorrect;

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                    isSubmitted
                      ? isCorrect
                        ? 'bg-emerald-600 text-white'
                        : isWrong
                        ? 'bg-rose-500 text-white'
                        : 'bg-stone-200 text-stone-600'
                      : isCurrent
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question */}
          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Câu hỏi {currentQuestionIdx + 1} / {totalQuestions}:
              </span>
              <h4 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
                {currentQ.question}
              </h4>
              {currentQ.koreanPrompt && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-base font-bold text-stone-800 flex items-center justify-between">
                  <span>{currentQ.koreanPrompt}</span>
                  <button
                    onClick={() => playKoreanAudio(currentQ.koreanPrompt || '', 1.0)}
                    className="p-1.5 rounded-lg bg-white border border-stone-200 text-emerald-700 hover:bg-emerald-50"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = answers[currentQuestionIdx] === optIdx;
                const isCorrectAnswer = isSubmitted && optIdx === currentQ.correctIndex;
                const isWrongSelection = isSubmitted && isSelected && !isCorrectAnswer;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isSubmitted}
                    className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${
                      isSubmitted
                        ? isCorrectAnswer
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/30'
                          : isWrongSelection
                          ? 'border-rose-400 bg-rose-50 text-rose-900'
                          : 'border-stone-200 opacity-60'
                        : isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 shadow-xs ring-1 ring-emerald-500'
                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isSubmitted && isCorrectAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isSubmitted && isWrongSelection && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation after submission */}
            {isSubmitted && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 space-y-1 animate-in fade-in">
                <span className="font-bold flex items-center gap-1 text-amber-800">
                  <HelpCircle className="w-4 h-4 text-amber-600" /> Giải thích chi tiết:
                </span>
                <p className="leading-relaxed text-stone-700">{currentQ.explanation}</p>
              </div>
            )}
          </div>

          {/* Navigation & Submit Buttons */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
              disabled={currentQuestionIdx === 0}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl disabled:opacity-30 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Câu trước
            </button>

            {!isSubmitted ? (
              <div className="flex items-center gap-2">
                {currentQuestionIdx < totalQuestions - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIdx((p) => p + 1)}
                    className="px-5 py-2.5 bg-stone-800 hover:bg-stone-900 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    Câu tiếp theo
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Nộp bài thi
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleStartExam(selectedExam)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Làm lại đề này
                </button>
                <button
                  onClick={() => setIsTesting(false)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Chọn đề khác
                </button>
              </div>
            )}
          </div>

          {/* Results Summary Modal / Card */}
          {isSubmitted && (
            <div className="p-6 rounded-3xl bg-emerald-50/80 border border-emerald-200 text-center space-y-3">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-600 text-white text-xl font-black mx-auto shadow-md">
                {scorePercent}%
              </div>
              <h4 className="text-xl font-bold text-stone-900">
                {scorePercent >= 60 ? 'Chúc mừng! Bạn đã đạt yêu cầu bài thi' : 'Cần cố gắng ôn tập thêm nhé'}
              </h4>
              <p className="text-xs text-stone-600">
                Số câu đúng: <strong className="text-emerald-800">{correctCount}</strong> / {totalQuestions} câu.
                Bạn có thể xem lại từng câu hỏi và lời giải thích chi tiết ở trên.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
