import React, { useState } from 'react';
import { UserProfile } from '../../types';
import { Sparkles, BookOpen, GraduationCap, Award, Compass, CheckCircle2 } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (updatedProfile: Partial<UserProfile>) => void;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [priorExperience, setPriorExperience] = useState<string>('');
  const [selectedGoal, setSelectedGoal] = useState<string>('Học từ đầu (Sơ cấp 1)');
  const [dailyGoal, setDailyGoal] = useState<number>(10);

  if (!isOpen) return null;

  const handleFinish = () => {
    let suggestedLevel = 'Sơ cấp 1';
    if (selectedGoal.includes('TOPIK II')) suggestedLevel = 'Trung cấp';
    else if (selectedGoal.includes('TOPIK I')) suggestedLevel = 'Sơ cấp 2';

    onComplete({
      hasCompletedOnboarding: true,
      targetGoal: selectedGoal,
      level: suggestedLevel,
      dailyGoal,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-[#FFFDF9] rounded-3xl border border-stone-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Chào mừng bạn đến với KOREAN VOCAB
          </div>
          <h2 className="text-2xl font-bold">Khảo Sát Mục Tiêu & Lộ Trình</h2>
          <p className="text-xs text-emerald-100 mt-1">
            Thiết lập lộ trình cá nhân hóa để học từ vựng hiệu quả nhất
          </p>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-600" />
                Bạn đã từng học tiếng Hàn chưa?
              </h3>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'newbie',
                    title: 'Chưa từng học, bắt đầu từ con số 0',
                    desc: 'Cần học từ bảng chữ cái Hangeul và cách ghép âm căn bản',
                    goal: 'Học từ đầu (Sơ cấp 1)',
                  },
                  {
                    id: 'elementary',
                    title: 'Đã thuộc bảng chữ cái, biết vài câu chào hỏi',
                    desc: 'Muốn mở rộng vốn từ vựng sinh hoạt và giao tiếp hàng ngày',
                    goal: 'Giao tiếp hàng ngày',
                  },
                  {
                    id: 'topik1',
                    title: 'Đang ôn thi chứng chỉ TOPIK I (Level 1-2)',
                    desc: 'Cần bồi dưỡng từ vựng trọng điểm và ngữ pháp xuất hiện trong đề',
                    goal: 'Luyện thi TOPIK I',
                  },
                  {
                    id: 'topik2',
                    title: 'Muốn chinh phục TOPIK II (Level 3 trở lên)',
                    desc: 'Học từ vựng nâng cao, cụm từ thành ngữ và liên từ kết nối',
                    goal: 'Luyện thi TOPIK II',
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setPriorExperience(item.id);
                      setSelectedGoal(item.goal);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                      priorExperience === item.id
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500'
                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                        priorExperience === item.id
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-stone-300'
                      }`}
                    >
                      {priorExperience === item.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-stone-800">{item.title}</p>
                      <p className="text-xs text-stone-500 mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-medium text-stone-400 hover:text-stone-600"
                >
                  Bỏ qua lúc này
                </button>
                <button
                  disabled={!priorExperience}
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-emerald-600 disabled:opacity-50 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-xs"
                >
                  Tiếp tục &rarr;
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  Mục tiêu số từ học mỗi ngày của bạn:
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Duy trì đều đặn 10-15 phút học mỗi ngày sẽ tạo nên sự khác biệt vượt trội
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { count: 5, label: 'Thong thả', time: '5 phút/ngày' },
                  { count: 10, label: 'Tiêu chuẩn', time: '10 phút/ngày', rec: true },
                  { count: 20, label: 'Bứt tốc', time: '20 phút/ngày' },
                ].map((target) => (
                  <button
                    key={target.count}
                    onClick={() => setDailyGoal(target.count)}
                    className={`p-3.5 rounded-2xl border text-center relative transition-all ${
                      dailyGoal === target.count
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500'
                        : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    {target.rec && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-medium shadow-xs">
                        Gợi ý
                      </span>
                    )}
                    <span className="text-2xl font-black text-stone-800">{target.count}</span>
                    <span className="text-xs text-stone-500 block font-medium">từ / ngày</span>
                    <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                      {target.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Quick Summary of Recommended Roadmap */}
              <div className="p-4 rounded-2xl bg-stone-100/80 border border-stone-200/80 space-y-2">
                <p className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Lộ trình học tập đề xuất cho bạn:
                </p>
                <div className="flex items-center gap-2.5 text-xs text-stone-700">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900">{selectedGoal}</span>
                    <p className="text-[11px] text-stone-500">
                      Được tự động kích hoạt tại mục <strong>Tiến độ học tập</strong> với bài tập củng cố sau mỗi bài và bài kiểm tra tổng hợp định kỳ 3 bài/lần.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-700"
                >
                  &larr; Quay lại
                </button>
                <button
                  onClick={handleFinish}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-emerald-600/20"
                >
                  Bắt đầu học ngay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
