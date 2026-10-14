import React, { useState } from 'react';
import { Word, CustomNotebook } from '../../types';
import { getCustomNotebooks, toggleWordInNotebook } from '../../utils/storage';
import { Bookmark, Check, Plus, X, FolderPlus } from 'lucide-react';

interface SaveToNotebookModalProps {
  word: Word | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

export const SaveToNotebookModal: React.FC<SaveToNotebookModalProps> = ({
  word,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [notebooks, setNotebooks] = useState<CustomNotebook[]>(getCustomNotebooks());
  const [newNotebookName, setNewNotebookName] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);

  if (!isOpen || !word) return null;

  const handleToggle = (notebookId: string) => {
    toggleWordInNotebook(notebookId, word.id);
    setNotebooks(getCustomNotebooks());
    if (onUpdated) onUpdated();
  };

  const handleCreateAndAdd = () => {
    if (!newNotebookName.trim()) return;
    const current = getCustomNotebooks();
    const newNb: CustomNotebook = {
      id: 'nb-' + Date.now(),
      name: newNotebookName.trim(),
      description: 'Sổ tay tạo riêng',
      color: '#10B981',
      icon: 'Bookmark',
      createdAt: Date.now(),
      wordIds: [word.id],
    };
    const updated = [...current, newNb];
    localStorage.setItem('korean_vocab_notebooks', JSON.stringify(updated));
    setNotebooks(updated);
    setNewNotebookName('');
    setShowCreateInput(false);
    if (onUpdated) onUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-[#FFFDF9] rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Lưu vào Sổ tay từ vựng</h3>
              <p className="text-xs text-stone-500">
                Từ: <span className="font-semibold text-emerald-700">{word.korean}</span> ({word.vietnamese})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">
            Chọn sổ tay để thêm hoặc gỡ từ:
          </p>

          <div className="space-y-2">
            {notebooks.map((nb) => {
              const isIncluded = nb.wordIds.includes(word.id);
              return (
                <button
                  key={nb.id}
                  onClick={() => handleToggle(nb.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                    isIncluded
                      ? 'border-emerald-500 bg-emerald-50/60 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full border flex items-center justify-center transition-colors"
                      style={{
                        backgroundColor: isIncluded ? nb.color : 'transparent',
                        borderColor: isIncluded ? nb.color : '#D6D3D1',
                      }}
                    >
                      {isIncluded && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-800">{nb.name}</p>
                      <p className="text-xs text-stone-500">
                        {nb.wordIds.length} từ vựng
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                      isIncluded
                        ? 'text-emerald-700 bg-emerald-100/80'
                        : 'text-stone-400 bg-stone-100'
                    }`}
                  >
                    {isIncluded ? 'Đã lưu' : 'Bấm để thêm'}
                  </span>
                </button>
              );
            })}
          </div>

          {showCreateInput ? (
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <label className="text-xs font-semibold text-stone-700">Tên sổ tay mới:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ví dụ: Từ vựng phim Hàn..."
                  value={newNotebookName}
                  onChange={(e) => setNewNotebookName(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
                <button
                  onClick={handleCreateAndAdd}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Tạo & Lưu
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCreateInput(true)}
              className="w-full mt-2 py-2.5 px-3 border border-dashed border-stone-300 hover:border-emerald-500 hover:text-emerald-700 rounded-xl text-stone-600 text-xs font-medium flex items-center justify-center gap-2 transition-colors bg-stone-50/50"
            >
              <FolderPlus className="w-4 h-4 text-emerald-600" />
              Tạo bộ sổ tay từ vựng mới
            </button>
          )}
        </div>

        <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors shadow-xs"
          >
            Hoàn tất
          </button>
        </div>
      </div>
    </div>
  );
};
