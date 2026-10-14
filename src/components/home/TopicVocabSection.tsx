import React, { useState } from 'react';
import { Topic, Word } from '../../types';
import { TOPICS, INITIAL_WORDS } from '../../data/vocabulary';
import { playKoreanAudio } from '../../utils/audio';
import {
  Sun,
  UtensilsCrossed,
  Plane,
  GraduationCap,
  Heart,
  Award,
  BookOpen,
  ShoppingBag,
  Activity,
  Layers,
  Volume2,
  Bookmark,
  Search,
  Check,
  ChevronRight,
} from 'lucide-react';

interface TopicVocabSectionProps {
  onSaveWordToNotebook: (word: Word) => void;
  onStartTopicReview: (topicId: string) => void;
}

export const TopicVocabSection: React.FC<TopicVocabSectionProps> = ({
  onSaveWordToNotebook,
  onStartTopicReview,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(TOPICS[0].id);
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [keywordFilter, setKeywordFilter] = useState<string>('');

  const currentTopic = TOPICS.find((t) => t.id === selectedTopicId) || TOPICS[0];

  const wordsInTopic = INITIAL_WORDS.filter((w) => {
    if (w.topicId !== selectedTopicId) return false;
    if (levelFilter !== 'all' && w.level !== levelFilter) return false;
    if (keywordFilter.trim()) {
      const q = keywordFilter.toLowerCase();
      return (
        w.korean.toLowerCase().includes(q) ||
        w.vietnamese.toLowerCase().includes(q) ||
        w.romaja.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return <Sun className="w-5 h-5" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-5 h-5" />;
      case 'Plane': return <Plane className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      case 'Heart': return <Heart className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto space-y-8 pt-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Layers className="w-3.5 h-3.5" />
            Học tập có hệ thống
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Từ Vựng Theo Chủ Đề
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Chọn chủ đề bạn quan tâm để khám phá từ vựng, nghe phát âm và thêm vào sổ tay luyện tập
          </p>
        </div>

        <button
          onClick={() => onStartTopicReview(selectedTopicId)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md shadow-emerald-600/25 flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Layers className="w-4 h-4" />
          Luyện Flashcard chủ đề này
        </button>
      </div>

      {/* Topic Cards Horizontal / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {TOPICS.map((topic) => {
          const isSelected = topic.id === selectedTopicId;
          return (
            <button
              key={topic.id}
              onClick={() => {
                setSelectedTopicId(topic.id);
                setKeywordFilter('');
              }}
              className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                isSelected
                  ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/30 shadow-md'
                  : 'border-stone-200/90 bg-[#FFFDF9] hover:border-emerald-300 hover:bg-emerald-50/30 shadow-2xs'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                {getTopicIcon(topic.icon)}
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-emerald-700 block">
                  {topic.nameKorean}
                </span>
                <p className="text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {topic.name}
                </p>
                <p className="text-[11px] text-stone-400">
                  {topic.wordCount} từ vựng
                </p>
              </div>

              {isSelected && (
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-emerald-600" />
              )}
            </button>
          );
        })}
      </div>

      {/* Words List inside Selected Topic */}
      <div className="bg-[#FFFDF9] rounded-3xl border border-stone-200/90 shadow-md p-6 sm:p-7 space-y-6">
        {/* Topic Banner & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800">
                {currentTopic.nameKorean}
              </span>
              <h3 className="text-xl font-bold text-stone-900">
                {currentTopic.name}
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {currentTopic.description}
            </p>
          </div>

          {/* Search inside topic & Level filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={keywordFilter}
                onChange={(e) => setKeywordFilter(e.target.value)}
                placeholder="Lọc từ trong chủ đề..."
                className="pl-8 pr-3 py-1.5 text-xs bg-stone-100 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 w-44"
              />
            </div>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="py-1.5 px-3 text-xs bg-stone-100 border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 text-stone-700 font-medium"
            >
              <option value="all">Tất cả trình độ</option>
              <option value="Sơ cấp 1">Sơ cấp 1</option>
              <option value="Sơ cấp 2">Sơ cấp 2</option>
              <option value="TOPIK I">TOPIK I</option>
              <option value="TOPIK II">TOPIK II</option>
            </select>
          </div>
        </div>

        {/* Word Cards Grid */}
        {wordsInTopic.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wordsInTopic.map((word) => (
              <div
                key={word.id}
                className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 hover:border-emerald-400 hover:bg-white transition-all shadow-2xs space-y-3 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-stone-900 group-hover:text-emerald-700 transition-colors">
                        {word.korean}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {word.wordType}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 font-mono">[{word.romaja}]</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => playKoreanAudio(word.korean, 1.0)}
                      className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
                      title="Nghe phát âm chuẩn"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onSaveWordToNotebook(word)}
                      className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
                      title="Lưu vào Sổ tay từ vựng"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold text-stone-800">
                    {word.vietnamese}
                  </p>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-1 italic">
                    "{word.exampleKorean}"
                  </p>
                  <p className="text-[11px] text-stone-400 line-clamp-1">
                    {word.exampleVietnamese}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-stone-400 text-xs">
            Không tìm thấy từ vựng nào khớp với bộ lọc hiện tại.
          </div>
        )}
      </div>
    </section>
  );
};
