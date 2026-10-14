import React, { useState } from 'react';
import { Word, ErrorReport } from '../../types';
import { submitErrorReport } from '../../utils/storage';
import { AlertTriangle, CheckCircle2, Send, X } from 'lucide-react';

interface ErrorReportModalProps {
  word?: Word | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ErrorReportModal: React.FC<ErrorReportModalProps> = ({
  word,
  isOpen,
  onClose,
}) => {
  const [wordInput, setWordInput] = useState(word ? word.korean : '');
  const [errorType, setErrorType] = useState<ErrorReport['errorType']>('mistranslation');
  const [description, setDescription] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  React.useEffect(() => {
    if (word) {
      setWordInput(word.korean);
    }
  }, [word]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    submitErrorReport({
      wordId: word?.id,
      wordKorean: wordInput || word?.korean || 'Không rõ',
      errorType,
      description: description.trim(),
      reporterEmail: reporterEmail.trim() || undefined,
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setDescription('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-[#FFFDF9] rounded-2xl border border-stone-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">Báo cáo lỗi nội dung</h3>
              <p className="text-xs text-stone-500">Giúp đội ngũ hoàn thiện từ vựng chuẩn xác hơn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-stone-800">Cảm ơn bạn đã đóng góp!</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Báo cáo của bạn đã được ghi nhận. Quản trị viên sẽ kiểm tra và cập nhật lại dữ liệu từ điển sớm nhất.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Từ vựng hoặc câu cần báo lỗi:
              </label>
              <input
                type="text"
                value={wordInput}
                onChange={(e) => setWordInput(e.target.value)}
                placeholder="Ví dụ: 안녕하세요, ăn cơm..."
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Vấn đề phát hiện:
              </label>
              <select
                value={errorType}
                onChange={(e) => setErrorType(e.target.value as ErrorReport['errorType'])}
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
              >
                <option value="mistranslation">Dịch sai nghĩa tiếng Việt</option>
                <option value="audio_error">Phát âm hoặc phiên âm sai</option>
                <option value="example_error">Ví dụ mẫu câu chưa chuẩn</option>
                <option value="typo">Lỗi chính tả / Lỗi hiển thị</option>
                <option value="other">Vấn đề khác</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Mô tả chi tiết lỗi & Đề xuất sửa:
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Vui lòng nêu rõ nghĩa đúng hoặc điểm cần sửa..."
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email của bạn (không bắt buộc):
              </label>
              <input
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="Để nhận phản hồi khi lỗi được khắc phục..."
                className="w-full px-3.5 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                Gửi báo cáo
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
