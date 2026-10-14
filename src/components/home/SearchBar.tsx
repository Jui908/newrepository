import React, { useState, useEffect, useRef } from 'react';
import { Word, GrammarCheckResult } from '../../types';
import { INITIAL_WORDS } from '../../data/vocabulary';
import { searchDictionaryWords, isLikelySentence, checkSentenceGrammar } from '../../utils/grammarService';
import { playKoreanAudio, startKoreanSpeechRecognition, SpeechRecognitionResult } from '../../utils/audio';
import {
  getSearchHistory,
  addSearchHistory,
  clearSearchHistory,
} from '../../utils/storage';
import {
  Search,
  Volume2,
  Mic,
  MicOff,
  Bookmark,
  Sparkles,
  History,
  X,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface SearchBarProps {
  onSaveWordToNotebook: (word: Word) => void;
  onOpenReportError: (word?: Word) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSaveWordToNotebook,
  onOpenReportError,
}) => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'word' | 'grammar'>('word');
  const [searchResults, setSearchResults] = useState<Word[]>([]);
  const [selectedWord, setSelectedWord] = useState<Word | null>(INITIAL_WORDS[0]); // default word
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<1.0 | 0.75>(1.0);

  // Grammar check state
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);
  const [grammarResult, setGrammarResult] = useState<GrammarCheckResult | null>(null);

  // Speech recording state
  const [isRecording, setIsRecording] = useState(false);
  const [speechInterim, setSpeechInterim] = useState('');
  const [speechEvaluation, setSpeechEvaluation] = useState<SpeechRecognitionResult | null>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(getSearchHistory());
  }, []);

  // Handle click outside to close history
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autocomplete & query changes
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    // Auto-detect mode if user typed a sentence
    if (isLikelySentence(query)) {
      setMode('grammar');
    } else {
      setMode('word');
      const matches = searchDictionaryWords(query, INITIAL_WORDS);
      setSearchResults(matches);
      if (matches.length > 0) {
        setSelectedWord(matches[0]);
      }
    }
  }, [query]);

  const handleSearchSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setShowHistory(false);
    const updatedHistory = addSearchHistory(trimmed);
    setHistory(updatedHistory);

    if (isLikelySentence(trimmed) || mode === 'grammar') {
      setMode('grammar');
      setIsCheckingGrammar(true);
      setGrammarResult(null);
      try {
        const result = await checkSentenceGrammar(trimmed);
        setGrammarResult(result);
      } catch (err) {
        console.error('Grammar check error:', err);
      } finally {
        setIsCheckingGrammar(false);
      }
    } else {
      setMode('word');
      const matches = searchDictionaryWords(trimmed, INITIAL_WORDS);
      setSearchResults(matches);
      if (matches.length > 0) {
        setSelectedWord(matches[0]);
      } else {
        // If not in standard list, generate a contextual word card
        const dynamicWord: Word = {
          id: 'dyn-' + Date.now(),
          korean: /[가-힣]/.test(trimmed) ? trimmed : '선택 từ',
          vietnamese: /[가-힣]/.test(trimmed) ? 'Đang cập nhật nghĩa' : trimmed,
          wordType: 'Danh từ',
          romaja: 'dang tra cuu',
          exampleKorean: `${trimmed}을/를 사용합니다.`,
          exampleVietnamese: `Sử dụng "${trimmed}" trong đời sống.`,
          level: 'Sơ cấp 1',
          topicId: 'daily-life',
        };
        setSelectedWord(dynamicWord);
      }
    }
  };

  const handleSelectHistoryItem = (item: string) => {
    setQuery(item);
    setShowHistory(false);
    // Execute search immediately
    setTimeout(() => {
      if (isLikelySentence(item)) {
        setMode('grammar');
        setIsCheckingGrammar(true);
        checkSentenceGrammar(item).then((res) => {
          setGrammarResult(res);
          setIsCheckingGrammar(false);
        });
      } else {
        setMode('word');
        const matches = searchDictionaryWords(item, INITIAL_WORDS);
        setSearchResults(matches);
        if (matches.length > 0) setSelectedWord(matches[0]);
      }
    }, 50);
  };

  const handlePlayAudio = async (text: string, speed: number = audioSpeed) => {
    setIsPlayingAudio(true);
    await playKoreanAudio(text, speed);
    setIsPlayingAudio(false);
  };

  const handleStartSpeechPractice = async (targetKorean: string) => {
    setIsRecording(true);
    setSpeechInterim('');
    setSpeechEvaluation(null);

    try {
      const result = await startKoreanSpeechRecognition(targetKorean, (interim) => {
        setSpeechInterim(interim);
      });
      setSpeechEvaluation(result);
    } catch (err) {
      console.warn('Speech error:', err);
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6" ref={searchContainerRef}>
      {/* Search Header Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Thanh tìm kiếm thông minh 2 trong 1
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
          Tra Từ Điển & Kiểm Tra Ngữ Pháp AI
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
          Tra từ 2 chiều Hàn - Việt, nghe phát âm chuẩn/chậm, kiểm tra câu hoàn chỉnh và luyện nói cùng AI.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-center">
        <div className="p-1 bg-stone-200/70 rounded-2xl flex items-center gap-1 shadow-inner">
          <button
            onClick={() => setMode('word')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'word'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Tra từ đơn (2 chiều Hàn &harr; Việt)
          </button>
          <button
            onClick={() => {
              setMode('grammar');
              if (query && isLikelySentence(query) && !grammarResult) {
                handleSearchSubmit();
              }
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'grammar'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Kiểm tra câu (Grammar Check Mode)
          </button>
        </div>
      </div>

      {/* Main Input Box */}
      <div className="relative">
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center bg-[#FFFDF9] rounded-3xl border-2 border-stone-200 hover:border-emerald-500/80 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-500/10 shadow-lg shadow-stone-200/50 transition-all p-2"
        >
          <div className="pl-3 pr-2 text-stone-400">
            <Search className="w-5 h-5 text-emerald-600" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowHistory(true)}
            placeholder={
              mode === 'word'
                ? 'Nhập từ tiếng Hàn (ví dụ: 아침, 사랑) hoặc tiếng Việt (cơm, đi học)...'
                : 'Nhập câu tiếng Hàn cần kiểm tra (ví dụ: 저은 밥를 먹아요, 학교에 가요)...'
            }
            className="flex-1 bg-transparent px-2 py-3 text-stone-900 placeholder:text-stone-400 text-sm sm:text-base focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSearchResults([]);
                setGrammarResult(null);
                setSpeechEvaluation(null);
              }}
              className="p-1.5 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-100 transition-colors mr-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md shadow-emerald-600/25 flex items-center gap-1.5 shrink-0"
          >
            {isCheckingGrammar ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Đang phân tích...
              </>
            ) : mode === 'grammar' ? (
              <>
                <Sparkles className="w-4 h-4" />
                Kiểm tra câu
              </>
            ) : (
              'Tìm kiếm'
            )}
          </button>
        </form>

        {/* Autocomplete & Recent History Popup */}
        {showHistory && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#FFFDF9] rounded-2xl border border-stone-200 shadow-xl p-4 z-30 animate-in fade-in zoom-in-95">
            {searchResults.length > 0 ? (
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2 mb-2">
                  Gợi ý từ phù hợp:
                </p>
                {searchResults.slice(0, 5).map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      setSelectedWord(w);
                      setQuery(w.korean);
                      setShowHistory(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left hover:bg-emerald-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-stone-900 group-hover:text-emerald-700 text-sm">
                        {w.korean}
                      </span>
                      <span className="text-xs text-stone-400">[{w.romaja}]</span>
                      <span className="text-xs text-stone-600">{w.vietnamese}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                      {w.wordType}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500">
                    <History className="w-3.5 h-3.5" />
                    Lịch sử tìm kiếm gần đây
                  </div>
                  {history.length > 0 && (
                    <button
                      onClick={() => {
                        clearSearchHistory();
                        setHistory([]);
                      }}
                      className="text-[11px] text-stone-400 hover:text-stone-600"
                    >
                      Xóa tất cả
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {history.length > 0 ? (
                    history.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectHistoryItem(item)}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-100 hover:text-emerald-800 text-stone-700 text-xs font-medium transition-colors"
                      >
                        {item}
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-stone-400 py-1">Chưa có lịch sử tìm kiếm nào.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Grammar Check Mode Result Card */}
      {mode === 'grammar' && grammarResult && (
        <div className="bg-[#FFFDF9] rounded-3xl border border-stone-200/90 shadow-md p-6 space-y-6 animate-in fade-in slide-in-from-top-3">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span
                className={`p-1.5 rounded-xl ${
                  grammarResult.isCorrect
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {grammarResult.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </span>
              <div>
                <h3 className="font-bold text-stone-900 text-base">
                  {grammarResult.isCorrect
                    ? 'Câu của bạn hoàn toàn chuẩn xác!'
                    : 'Đã phát hiện điểm cần sửa lỗi ngữ pháp'}
                </h3>
                <p className="text-xs text-stone-500">
                  {grammarResult.overallExplanation}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSearchSubmit()}
              className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Kiểm tra lại
            </button>
          </div>

          {/* Original with Red Underline if errors exist */}
          {!grammarResult.isCorrect && (
            <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                Câu bạn đã nhập (gạch chân đỏ những chỗ sai):
              </span>
              <p className="text-lg font-bold text-stone-800 leading-relaxed">
                {grammarResult.original.split(' ').map((wordPart, i) => {
                  const errorFound = grammarResult.errors.find((err) =>
                    wordPart.includes(err.targetText)
                  );
                  if (errorFound) {
                    return (
                      <span
                        key={i}
                        className="underline decoration-wavy decoration-rose-500 text-rose-700 font-extrabold mr-2 px-1 bg-rose-100/60 rounded"
                        title={errorFound.explanation}
                      >
                        {wordPart}
                      </span>
                    );
                  }
                  return <span key={i} className="mr-2">{wordPart}</span>;
                })}
              </p>
            </div>
          )}

          {/* Suggested Fix (Câu chuẩn xác) */}
          <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Câu chuẩn xác (Suggested Fix):
              </span>

              {/* Pronunciation button for corrected sentence */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlayAudio(grammarResult.suggestedFix, 1.0)}
                  disabled={isPlayingAudio}
                  className="px-3 py-1 rounded-xl bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Nghe chuẩn (1.0x)
                </button>
                <button
                  onClick={() => handlePlayAudio(grammarResult.suggestedFix, 0.75)}
                  disabled={isPlayingAudio}
                  className="px-3 py-1 rounded-xl bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Nghe chậm (0.75x)
                </button>
              </div>
            </div>

            <p className="text-xl sm:text-2xl font-black text-stone-900 tracking-wide">
              {grammarResult.suggestedFix}
            </p>

            <div className="pt-2 border-t border-emerald-200/60">
              <p className="text-xs font-medium text-emerald-900">
                <strong className="text-stone-800">Dịch nghĩa tiếng Việt: </strong>
                {grammarResult.vietnameseTranslation}
              </p>
            </div>
          </div>

          {/* Error Details Breakdown */}
          {grammarResult.errors.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Chi tiết sửa lỗi & Giải thích ngữ pháp:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {grammarResult.errors.map((err, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-600 line-through">
                        {err.targetText}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                      <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        {err.replacement}
                      </span>
                    </div>
                    <p className="font-bold text-stone-800">{err.issueType}</p>
                    <p className="text-stone-600 leading-relaxed">{err.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Single Word Mode: Result Card */}
      {mode === 'word' && selectedWord && (
        <div className="bg-[#FFFDF9] rounded-3xl border border-stone-200/90 shadow-md p-6 sm:p-7 space-y-6 transition-all animate-in fade-in zoom-in-98">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
                  {selectedWord.korean}
                </h2>
                {selectedWord.hanja && (
                  <span className="text-xs text-stone-400 font-serif">
                    [{selectedWord.hanja}]
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {selectedWord.wordType}
                </span>
                <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-stone-100 text-stone-600 border border-stone-200">
                  {selectedWord.level}
                </span>
              </div>
              <p className="text-xs font-semibold text-emerald-700 mt-1">
                Phiên âm Romaja: <span className="font-mono">{selectedWord.romaja}</span>
              </p>
            </div>

            {/* Actions: Listen Audio & Save */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Standard audio */}
              <button
                onClick={() => handlePlayAudio(selectedWord.korean, 1.0)}
                disabled={isPlayingAudio}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                title="Nghe phát âm chuẩn tốc độ 1.0x"
              >
                <Volume2 className="w-4 h-4 text-emerald-600" />
                Chuẩn (1.0x)
              </button>

              {/* Slow audio */}
              <button
                onClick={() => handlePlayAudio(selectedWord.korean, 0.75)}
                disabled={isPlayingAudio}
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                title="Nghe phát âm chậm tốc độ 0.75x cho người mới"
              >
                <Volume2 className="w-4 h-4 text-stone-500" />
                Chậm (0.75x)
              </button>

              {/* Save to Notebook */}
              <button
                onClick={() => onSaveWordToNotebook(selectedWord)}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Bookmark className="w-4 h-4 text-emerald-600" />
                Lưu vào Sổ tay
              </button>

              {/* Report error */}
              <button
                onClick={() => onOpenReportError(selectedWord)}
                className="p-2 rounded-xl bg-white hover:bg-rose-50 border border-stone-200 text-stone-400 hover:text-rose-600 transition-colors"
                title="Báo lỗi từ này"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Meaning & Details */}
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                Nghĩa tiếng Việt:
              </p>
              <p className="text-xl font-bold text-stone-900 mt-0.5">
                {selectedWord.vietnamese}
              </p>
            </div>

            {/* Example sentence */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  Mẫu câu ví dụ thực tế:
                </span>
                <button
                  onClick={() => handlePlayAudio(selectedWord.exampleKorean, 1.0)}
                  className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  Nghe câu ví dụ
                </button>
              </div>
              <p className="text-sm sm:text-base font-bold text-stone-800">
                {selectedWord.exampleKorean}
              </p>
              <p className="text-xs text-stone-600">
                {selectedWord.exampleVietnamese}
              </p>
            </div>

            {selectedWord.notes && (
              <p className="text-xs text-amber-800 bg-amber-50/80 border border-amber-200/80 px-3.5 py-2 rounded-xl font-medium">
                💡 <strong className="text-stone-800">Mẹo ghi nhớ & Ngữ pháp:</strong> {selectedWord.notes}
              </p>
            )}

            {/* Speaking Practice Mic Section */}
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-emerald-600" />
                    Luyện nói & Chấm điểm phát âm bằng AI
                  </span>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Nhấn vào Mic và đọc to từ "{selectedWord.korean}" để hệ thống phân tích
                  </p>
                </div>

                <button
                  onClick={() => handleStartSpeechPractice(selectedWord.korean)}
                  disabled={isRecording}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse shadow-md'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4 animate-spin" />
                      Đang lắng nghe...
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Bật Mic đọc thử
                    </>
                  )}
                </button>
              </div>

              {speechInterim && (
                <div className="text-xs text-stone-600 italic bg-white/70 p-2 rounded-lg border border-stone-200">
                  Bạn đang nói: <span className="font-semibold text-emerald-700">"{speechInterim}"</span>
                </div>
              )}

              {/* Speech Result Card */}
              {speechEvaluation && (
                <div className="p-3.5 bg-white rounded-xl border border-stone-200 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700">
                      Bạn đã phát âm: <span className="text-stone-900">"{speechEvaluation.transcript}"</span>
                    </span>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        speechEvaluation.accuracyScore >= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : speechEvaluation.accuracyScore >= 60
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      Điểm: {speechEvaluation.accuracyScore}/100
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {speechEvaluation.feedback}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
