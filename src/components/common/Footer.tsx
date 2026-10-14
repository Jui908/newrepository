import React, { useState } from 'react';
import { BookOpen, Shield, Mail, Globe, Heart, AlertCircle, X } from 'lucide-react';

interface FooterProps {
  onOpenReport: () => void;
  onOpenRoadmap: () => void;
  onOpenReview: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenReport,
  onOpenRoadmap,
  onOpenReview,
}) => {
  const [modalPolicy, setModalPolicy] = useState<'terms' | 'privacy' | null>(null);

  return (
    <footer className="mt-20 border-t border-stone-200/90 bg-[#F4EFEA] text-stone-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: About */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
                한
              </div>
              <span className="font-extrabold text-base tracking-tight text-stone-900">
                KOREAN VOCAB
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Nền tảng học và ghi nhớ từ vựng tiếng Hàn thông minh. Kết hợp phương pháp Spaced Repetition (Lặp lại ngắt quãng), luyện phản xạ phát âm và kiểm tra ngữ pháp câu bằng AI.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold pt-1">
              <Heart className="w-4 h-4 fill-emerald-600 text-emerald-600" />
              Đồng hành cùng hàng ngàn học viên TOPIK
            </div>
          </div>

          {/* Col 2: Methods & Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Phương pháp học
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <button
                  onClick={onOpenReview}
                  className="hover:text-emerald-700 transition-colors"
                >
                  Flashcard Spaced Repetition (SM-2)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRoadmap}
                  className="hover:text-emerald-700 transition-colors"
                >
                  Lộ trình từng bước cho người mới bắt đầu
                </button>
              </li>
              <li>
                <span className="text-stone-500">
                  Luyện tập phát âm chuẩn & Chấm điểm giọng nói
                </span>
              </li>
              <li>
                <span className="text-stone-500">
                  Kiểm tra ngữ pháp câu & trợ từ thông minh
                </span>
              </li>
            </ul>
          </div>

          {/* Col 3: Support & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Hỗ trợ & Pháp lý
            </h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <button
                  onClick={() => setModalPolicy('terms')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  Điều khoản sử dụng
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalPolicy('privacy')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  Chính sách bảo mật thông tin
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenReport}
                  className="text-amber-700 font-medium hover:underline flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  Báo lỗi nội dung từ vựng
                </button>
              </li>
              <li>
                <span className="text-stone-500">Email: hotro@koreanvocab.vn</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & Social Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Cộng đồng & Liên kết
            </h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Theo dõi cộng đồng tự học tiếng Hàn để nhận các bộ từ vựng theo chủ đề hot mỗi tuần.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="#facebook"
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-xl bg-stone-200 hover:bg-emerald-600 hover:text-white flex items-center justify-center text-stone-600 transition-colors"
                title="Facebook Group"
              >
                <span className="font-bold text-xs">f</span>
              </a>
              <a
                href="#youtube"
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-xl bg-stone-200 hover:bg-rose-600 hover:text-white flex items-center justify-center text-stone-600 transition-colors"
                title="YouTube Học tiếng Hàn"
              >
                <span className="font-bold text-xs">YT</span>
              </a>
              <a
                href="#tiktok"
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-xl bg-stone-200 hover:bg-stone-900 hover:text-white flex items-center justify-center text-stone-600 transition-colors"
                title="TikTok Từ vựng mỗi ngày"
              >
                <span className="font-bold text-xs">TT</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-stone-300/70 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} KOREAN VOCAB. Mọi quyền được bảo lưu.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" /> Nền tảng học ngoại ngữ số 1 cho người Việt
            </span>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {modalPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-[#FFFDF9] rounded-2xl border border-stone-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-stone-900 text-base">
                {modalPolicy === 'terms' ? 'Điều khoản sử dụng' : 'Chính sách bảo mật'}
              </h3>
              <button
                onClick={() => setModalPolicy(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-stone-600 space-y-2.5 max-h-72 overflow-y-auto leading-relaxed">
              {modalPolicy === 'terms' ? (
                <>
                  <p>
                    1. Ứng dụng Korean Vocab cung cấp các công cụ học tập miễn phí nhằm phục vụ mục đích nâng cao vốn từ vựng và ngữ pháp tiếng Hàn cho học sinh, sinh viên và người ôn thi TOPIK.
                  </p>
                  <p>
                    2. Người dùng có quyền tự tạo các bộ sổ tay từ vựng cá nhân và chia sẻ hoặc ôn tập theo nhu cầu riêng.
                  </p>
                  <p>
                    3. Mọi phản hồi hoặc báo lỗi từ vựng sẽ được xem xét và xử lý bởi ban quản trị nội dung.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    1. Chúng tôi cam kết bảo mật tuyệt đối thông tin tài khoản, email và tiến độ học tập của người dùng.
                  </p>
                  <p>
                    2. Dữ liệu ghi nhớ flashcard và sổ tay cá nhân được lưu trữ bảo đảm quyền riêng tư của từng học viên.
                  </p>
                  <p>
                    3. Hệ thống không chia sẻ thông tin cho bất kỳ bên thứ ba nào vì mục đích thương mại không chính đáng.
                  </p>
                </>
              )}
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setModalPolicy(null)}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
