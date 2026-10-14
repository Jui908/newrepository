import React, { useState } from 'react';
import { CustomNotebook, Word } from '../../types';
import { INITIAL_WORDS } from '../../data/vocabulary';
import {
  getCustomNotebooks,
  saveCustomNotebooks,
  toggleWordInNotebook,
} from '../../utils/storage';
import { playKoreanAudio } from '../../utils/audio';
import {
  Bookmark,
  FolderPlus,
  Trash2,
  Edit2,
  Volume2,
  Layers,
  Check,
  X,
  Palette,
  Sparkles,
} from 'lucide-react';

interface NotebooksViewProps {
  onStartFlashcardReview: (words: Word[]) => void;
  onOpenSaveModal: (word: Word) => void;
}

const AVAILABLE_COLORS = [
  '#10B981', // emerald
  '#0284C7', // sky
  '#F59E0B', // amber
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#EF4444', // red
  '#14B8A6', // teal
];

export const NotebooksView: React.FC<NotebooksViewProps> = ({
  onStartFlashcardReview,
  onOpenSaveModal,
}) => {
  const [notebooks, setNotebooks] = useState<CustomNotebook[]>(getCustomNotebooks());
  const [selectedNotebookId, setSelectedNotebookId] = useState<string>(
    notebooks[0]?.id || ''
  );

  // Create or edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotebook, setEditingNotebook] = useState<CustomNotebook | null>(null);
  const [notebookName, setNotebookName] = useState('');
  const [notebookDesc, setNotebookDesc] = useState('');
  const [notebookColor, setNotebookColor] = useState(AVAILABLE_COLORS[0]);

  const currentNotebook =
    notebooks.find((nb) => nb.id === selectedNotebookId) || notebooks[0];

  const wordsInCurrentNotebook = currentNotebook
    ? INITIAL_WORDS.filter((w) => currentNotebook.wordIds.includes(w.id))
    : [];

  const handleOpenCreateModal = () => {
    setEditingNotebook(null);
    setNotebookName('');
    setNotebookDesc('');
    setNotebookColor(AVAILABLE_COLORS[0]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (nb: CustomNotebook) => {
    setEditingNotebook(nb);
    setNotebookName(nb.name);
    setNotebookDesc(nb.description);
    setNotebookColor(nb.color);
    setIsModalOpen(true);
  };

  const handleSaveNotebook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notebookName.trim()) return;

    if (editingNotebook) {
      const updated = notebooks.map((nb) =>
        nb.id === editingNotebook.id
          ? {
              ...nb,
              name: notebookName.trim(),
              description: notebookDesc.trim(),
              color: notebookColor,
            }
          : nb
      );
      saveCustomNotebooks(updated);
      setNotebooks(updated);
    } else {
      const newNb: CustomNotebook = {
        id: 'nb-' + Date.now(),
        name: notebookName.trim(),
        description: notebookDesc.trim() || 'Sổ tay từ vựng tự tạo',
        color: notebookColor,
        icon: 'Bookmark',
        createdAt: Date.now(),
        wordIds: [],
      };
      const updated = [...notebooks, newNb];
      saveCustomNotebooks(updated);
      setNotebooks(updated);
      setSelectedNotebookId(newNb.id);
    }

    setIsModalOpen(false);
  };

  const handleDeleteNotebook = (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sổ tay này không?')) return;
    const updated = notebooks.filter((nb) => nb.id !== id);
    saveCustomNotebooks(updated);
    setNotebooks(updated);
    if (selectedNotebookId === id) {
      setSelectedNotebookId(updated[0]?.id || '');
    }
  };

  const handleRemoveWord = (wordId: string) => {
    if (!currentNotebook) return;
    toggleWordInNotebook(currentNotebook.id, wordId);
    setNotebooks(getCustomNotebooks());
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            Cá nhân hóa việc học
          </div>
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">
            Sổ Tay Từ Vựng Tự Chọn
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Tự tạo và quản lý các bộ sổ tay theo sở thích: 'Từ vựng phim Hàn', 'Đi ăn nhà hàng', 'Từ vựng hay quên'...
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md shadow-emerald-600/25 flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <FolderPlus className="w-4 h-4" />
          Tạo sổ tay mới
        </button>
      </div>

      {/* Notebook Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {notebooks.map((nb) => {
          const isSelected = nb.id === currentNotebook?.id;
          return (
            <div
              key={nb.id}
              onClick={() => setSelectedNotebookId(nb.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 bg-white ring-2 ring-emerald-500/20 shadow-md'
                  : 'border-stone-200/90 bg-[#FFFDF9] hover:border-emerald-300 hover:bg-stone-50/50 shadow-2xs'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: nb.color }}
                  >
                    <Bookmark className="w-5 h-5" />
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenEditModal(nb)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                      title="Chỉnh sửa sổ tay"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {notebooks.length > 1 && (
                      <button
                        onClick={() => handleDeleteNotebook(nb.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Xóa sổ tay này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-stone-900 leading-tight">
                    {nb.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">
                    {nb.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between mt-4">
                <span className="text-xs font-semibold text-stone-400">
                  {nb.wordIds.length} từ vựng
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-emerald-100 text-emerald-800' : 'text-stone-400'
                  }`}
                >
                  {isSelected ? 'Đang chọn' : 'Nhấn để xem'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Words in Selected Notebook */}
      {currentNotebook && (
        <div className="bg-[#FFFDF9] rounded-3xl border border-stone-200/90 shadow-md p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
                style={{ backgroundColor: currentNotebook.color }}
              >
                <Bookmark className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-900">
                  {currentNotebook.name}
                </h3>
                <p className="text-xs text-stone-500">
                  {currentNotebook.description} &bull; {wordsInCurrentNotebook.length} từ
                </p>
              </div>
            </div>

            {wordsInCurrentNotebook.length > 0 && (
              <button
                onClick={() => onStartFlashcardReview(wordsInCurrentNotebook)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                Ôn Flashcard sổ tay này
              </button>
            )}
          </div>

          {wordsInCurrentNotebook.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {wordsInCurrentNotebook.map((word) => (
                <div
                  key={word.id}
                  className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between space-y-3 hover:bg-white transition-all group"
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
                        className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-emerald-700"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveWord(word.id)}
                        className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-400 hover:text-rose-600"
                        title="Gỡ khỏi sổ tay"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-stone-800">
                      {word.vietnamese}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-1 italic">
                      "{word.exampleKorean}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-2">
              <Bookmark className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs text-stone-500 font-medium">
                Sổ tay này hiện chưa có từ vựng nào.
              </p>
              <p className="text-xs text-stone-400">
                Hãy dùng thanh tìm kiếm hoặc mục Từ vựng theo chủ đề và nhấn "Lưu vào Sổ tay" để thêm từ nhé!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Notebook Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-[#FFFDF9] rounded-3xl border border-stone-200 shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-base">
                {editingNotebook ? 'Chỉnh sửa sổ tay' : 'Tạo sổ tay từ vựng mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotebook} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tên sổ tay:
                </label>
                <input
                  type="text"
                  required
                  value={notebookName}
                  onChange={(e) => setNotebookName(e.target.value)}
                  placeholder="Ví dụ: Từ vựng phim Hàn, Từ hay quên..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mô tả ngắn:
                </label>
                <input
                  type="text"
                  value={notebookDesc}
                  onChange={(e) => setNotebookDesc(e.target.value)}
                  placeholder="Ghi chú mục đích của sổ tay..."
                  className="w-full px-3.5 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-stone-500" />
                  Màu sắc đại diện:
                </label>
                <div className="flex items-center gap-2.5">
                  {AVAILABLE_COLORS.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setNotebookColor(col)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        notebookColor === col ? 'scale-110 border-stone-800' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Lưu sổ tay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
