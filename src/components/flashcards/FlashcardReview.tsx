import React, { useState, useEffect } from 'react';
import { Word, ReviewRating } from '../../types';
import { INITIAL_WORDS } from '../../data/vocabulary';
import { playKoreanAudio, startKoreanSpeechRecognition, SpeechRecognitionResult } from '../../utils/audio';
import { saveFlashcardRating, getFlashcardData } from '../../utils/storage';
import {
  Volume2,
  Mic,
  RotateCw,
  Bookmark,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Shuffle,
  ThumbsUp,
  BrainCircuit,
  VolumeX,
} from 'lucide-react';

interface FlashcardReviewProps {
  initialTopicId?: string;
  initialWordList?: Word[];
  onSaveToNotebook: (word: Word) => void;
  onOpenReportError: (word?: Word) => void;
}

export const FlashcardReview: React.FC<FlashcardReviewProps> = ({
  initialTopicId,
  initialWordList,
  onSaveToNotebook,
  onOpenReportError,
}) => {
  const [deck, setDeck] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<1.0 | 0.75>(1.0);

  // Speech recording
  const [isRecording, setIsRecording] = useState(false);
  const [speechEvaluation, setSpeechEvaluation] = useState<SpeechRecognitionResult | null>(null);

  // Stats
  const [learnedCount, setLearnedCount] = useState(0);

  useEffect(() => {
    let words = initialWordList || INITIAL_WORDS;
    if (initialTopicId && !initialWordList) {
      words = INITIAL_WORDS.filter((w) => w.topicId === initialTopicId);
      if (words.length === 0) words = INITIAL_WORDS;
    }
    setDeck([...words].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
    setSpeechEvaluation(null);
  }, [initialTopicId, initialWordList]);

  const currentWord = deck[currentIndex] || deck[0];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handlePlayAudio = async (e?: React.MouseEvent, speed: number = audioSpeed) => {
    if (e) e.stopPropagation();
    if (!currentWord) return;
    setIsPlayingAudio(true);
    await playKoreanAudio(currentWord.korean, speed);
    setIsPlayingAudio(false);
  };

  const handleRecordSpeech = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentWord) return;
    setIsRecording(true);
    setSpeechEvaluation(null);

    try {
      const res = await startKoreanSpeechRecognition(currentWord.korean);
      setSpeechEvaluation(res);
    } catch (err) {
      console.warn('Speech error:', err);
    } finally {
      setIsRecording(false);
    }
  };

  const handleRate = (rating: ReviewRating) => {
    if (!currentWord) return;
    saveFlashcardRating(currentWord.id, rating);
    if (rating === 'easy') {
      setLearnedCount((prev) => prev + 1);
    }

    // Move to next card
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      setSpeechEvaluation(null);
    } else {
      // Completed round
      alert('Chúc mừng! Bạn đã hoàn thành lượt ôn tập bộ thẻ từ vựng này!');
      setCurrentIndex(0);
      setIsFlipped(false);
      setSpeechEvaluation(null);
    }
  };

  if (!currentWord) {
    return (
      <div className="py-16 text-center">
        <p className="text-stone-500 text-sm">Chưa có từ vựng nào trong bộ thẻ.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header Info & Progress */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1">
            <BrainCircuit className="w-3.5 h-3.5" />
            Phương pháp Lặp lại ngắt quãng (Spaced Repetition)
          </div>
          <h2 className="text-2xl font-black text-stone-900">
            Ôn Tập Flashcard
          </h2>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-stone-400">Tiến độ thẻ:</span>
          <p className="text-base font-black text-emerald-700">
            {currentIndex + 1} / {deck.length}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-600 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / deck.length) * 100}%` }}
        />
      </div>

      {/* 3D Flashcard Container */}
      <div
        onClick={handleFlip}
        className="w-full min-h-[380px] sm:min-h-[420px] bg-[#FFFDF9] rounded-3xl border-2 border-stone-200/90 hover:border-emerald-400/90 shadow-xl cursor-pointer p-7 sm:p-9 flex flex-col justify-between relative transition-all duration-300 select-none group"
      >
        {/* Top bar on card */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {currentWord.level}
            </span>
            <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-stone-100 text-stone-600 border border-stone-200">
              {currentWord.wordType}
            </span>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onSaveToNotebook(currentWord)}
              className="p-2 rounded-xl bg-stone-100 hover:bg-emerald-100 text-stone-600 hover:text-emerald-700 transition-colors"
              title="Lưu vào Sổ tay từ vựng"
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenReportError(currentWord)}
              className="p-2 rounded-xl bg-stone-100 hover:bg-rose-100 text-stone-400 hover:text-rose-600 transition-colors"
              title="Báo lỗi từ này"
            >
              <AlertCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Front vs Back content */}
        {!isFlipped ? (
          /* Mặt trước: Từ tiếng Hàn + Nút phát âm (Chuẩn/Chậm) + Mic luyện nói */
          <div className="my-auto text-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight">
                {currentWord.korean}
              </h3>
              {currentWord.hanja && (
                <p className="text-xs text-stone-400 font-serif">
                  Hán Hàn: [{currentWord.hanja}]
                </p>
              )}
            </div>

            {/* Audio speed controls */}
            <div
              className="flex items-center justify-center gap-2.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => handlePlayAudio(e, 1.0)}
                disabled={isPlayingAudio}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-2 shadow-2xs transition-colors"
              >
                <Volume2 className="w-4 h-4 text-emerald-600" />
                Nghe chuẩn (1.0x)
              </button>
              <button
                onClick={(e) => handlePlayAudio(e, 0.75)}
                disabled={isPlayingAudio}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 font-bold text-xs flex items-center gap-2 transition-colors"
              >
                <Volume2 className="w-4 h-4 text-stone-500" />
                Nghe chậm (0.75x)
              </button>
            </div>

            {/* Speaking Practice Mic */}
            <div
              className="pt-2 flex flex-col items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleRecordSpeech}
                disabled={isRecording}
                className={`px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-stone-100 hover:bg-emerald-600 hover:text-white text-stone-700'
                }`}
              >
                <Mic className="w-4 h-4" />
                {isRecording ? 'Đang chấm điểm giọng nói...' : 'Luyện phát âm với Mic'}
              </button>

              {speechEvaluation && (
                <div className="text-xs p-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 max-w-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Bạn nói: <strong>"{speechEvaluation.transcript}"</strong></span>
                    <span className="font-bold text-emerald-700">{speechEvaluation.accuracyScore}/100đ</span>
                  </div>
                  <p className="text-[11px] text-stone-500">{speechEvaluation.feedback}</p>
                </div>
              )}
            </div>

            <p className="text-xs text-stone-400 font-medium flex items-center justify-center gap-1">
              <RotateCw className="w-3.5 h-3.5 animate-spin-reverse" />
              Chạm vào thẻ để lật xem nghĩa tiếng Việt & ví dụ
            </p>
          </div>
        ) : (
          /* Mặt sau: Nghĩa tiếng Việt + Từ loại + Ví dụ + Phiên âm */
          <div className="my-auto text-center space-y-5 animate-in fade-in zoom-in-95">
            <div>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Nghĩa tiếng Việt:
              </span>
              <h4 className="text-2xl sm:text-3xl font-black text-emerald-800 mt-1">
                {currentWord.vietnamese}
              </h4>
              <p className="text-xs text-stone-500 font-mono mt-1">
                Phiên âm chuẩn: [{currentWord.romaja}]
              </p>
            </div>

            {/* Example sentence */}
            <div
              className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-stone-400 uppercase">
                  Câu ví dụ:
                </span>
                <button
                  onClick={() => playKoreanAudio(currentWord.exampleKorean, 1.0)}
                  className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" /> Nghe ví dụ
                </button>
              </div>
              <p className="text-sm font-bold text-stone-900">
                {currentWord.exampleKorean}
              </p>
              <p className="text-xs text-stone-600">
                {currentWord.exampleVietnamese}
              </p>
            </div>

            {currentWord.notes && (
              <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-left">
                💡 {currentWord.notes}
              </p>
            )}
          </div>
        )}

        {/* Bottom prompt */}
        <div className="text-center pt-2 border-t border-stone-100 text-[11px] text-stone-400">
          {!isFlipped ? 'Nhấn để lật mặt sau' : 'Chọn mức độ nhớ bên dưới để xếp lịch ôn lại'}
        </div>
      </div>

      {/* 3-4 Spaced Repetition Rating Buttons */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-stone-500 text-center uppercase tracking-wider">
          Đánh giá mức độ nhớ sau khi lật thẻ:
        </p>

        <div className="grid grid-cols-3 gap-3">
          {/* Hard / Quên */}
          <button
            onClick={() => handleRate('hard')}
            className="p-3.5 rounded-2xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-800 text-center transition-all shadow-xs group"
          >
            <span className="block font-black text-sm group-hover:scale-105 transition-transform">
              Quên / Khó
            </span>
            <span className="text-[10px] text-rose-600 block mt-0.5">
              Ôn lại sau 10 phút
            </span>
          </button>

          {/* Good / Cần nhớ lại */}
          <button
            onClick={() => handleRate('good')}
            className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-800 text-center transition-all shadow-xs group"
          >
            <span className="block font-black text-sm group-hover:scale-105 transition-transform">
              Cần nhớ lại
            </span>
            <span className="text-[10px] text-amber-600 block mt-0.5">
              Ôn lại sau 1 ngày
            </span>
          </button>

          {/* Easy / Đã thuộc */}
          <button
            onClick={() => handleRate('easy')}
            className="p-3.5 rounded-2xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-center transition-all shadow-xs group ring-1 ring-emerald-400/30"
          >
            <span className="block font-black text-sm group-hover:scale-105 transition-transform">
              Đã thuộc (Easy)
            </span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">
              Ôn lại sau 4 ngày
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
